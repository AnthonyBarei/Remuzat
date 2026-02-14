<?php

namespace App\Mail\Transport;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Psr\EventDispatcher\EventDispatcherInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\Mailer\Envelope;
use Symfony\Component\Mailer\SentMessage;
use Symfony\Component\Mailer\Transport\AbstractTransport;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mime\Email;
use Symfony\Component\Mime\MessageConverter;

class BrevoApiTransport extends AbstractTransport
{
    private const API_URL = 'https://api.brevo.com/v3/smtp/email';

    private string $apiKey;
    private Client $client;

    public function __construct(
        string $apiKey,
        EventDispatcherInterface $dispatcher = null,
        LoggerInterface $logger = null
    ) {
        parent::__construct($dispatcher, $logger);
        $this->apiKey = $apiKey;
        $this->client = new Client([
            'timeout' => 30,
        ]);
    }

    protected function doSend(SentMessage $message): void
    {
        $email = MessageConverter::toEmail($message->getOriginalMessage());

        $payload = [
            'sender' => $this->formatAddress($email->getFrom()[0]),
            'to' => $this->formatAddresses($email->getTo()),
            'subject' => $email->getSubject(),
        ];

        if ($cc = $email->getCc()) {
            $payload['cc'] = $this->formatAddresses($cc);
        }

        if ($bcc = $email->getBcc()) {
            $payload['bcc'] = $this->formatAddresses($bcc);
        }

        if ($replyTo = $email->getReplyTo()) {
            $payload['replyTo'] = $this->formatAddress($replyTo[0]);
        }

        if ($htmlBody = $email->getHtmlBody()) {
            $payload['htmlContent'] = $htmlBody;
        }

        if ($textBody = $email->getTextBody()) {
            $payload['textContent'] = $textBody;
        }

        try {
            $response = $this->client->post(self::API_URL, [
                'headers' => [
                    'api-key' => $this->apiKey,
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                ],
                'json' => $payload,
            ]);

            if ($response->getStatusCode() >= 400) {
                throw new \RuntimeException(
                    'Brevo API returned error status ' . $response->getStatusCode()
                    . ': ' . $response->getBody()->getContents()
                );
            }
        } catch (GuzzleException $e) {
            throw new \RuntimeException('Brevo API request failed: ' . $e->getMessage(), 0, $e);
        }
    }

    /**
     * Format a single address for the Brevo API payload.
     */
    private function formatAddress(Address $address): array
    {
        $result = ['email' => $address->getAddress()];

        if ($name = $address->getName()) {
            $result['name'] = $name;
        }

        return $result;
    }

    /**
     * Format an array of addresses for the Brevo API payload.
     *
     * @param Address[] $addresses
     */
    private function formatAddresses(array $addresses): array
    {
        return array_map(fn (Address $addr) => $this->formatAddress($addr), $addresses);
    }

    public function __toString(): string
    {
        return 'brevo+api';
    }
}
