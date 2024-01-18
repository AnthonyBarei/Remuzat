<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\API\BaseController as BaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class LoginController extends BaseController
{
    public function authenticated(Request $req) {
        $logged_in = Auth::check();

        if ($logged_in) {
            return $this->sendResponse(['authenticated' => true], 'User logged in successfully.');
        } else {
            return $this->sendError('Unauthenticated.', ['error' => 'User is not logged in.'], 401);
        }
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'message' => 'fix errors', 'errors' => $validator->errors()], 500);
        }

        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = Auth::user();

            if ($user instanceof \App\Models\User) {
                $name = $user->firstname . (($user->lastname) ? " " . $user->lastname : "");

                $success['token'] = $user->createToken('UserLoginToken')->plainTextToken;
                $success['name'] = $name;
                $success['email'] = $user->email;

                return $this->sendResponse($success, 'User login successfully.');
            } else {
                return $this->sendError('Wrong instance of user.', ['error' => 'Wrong instance of user'], 500);
            }
        } else {
            return $this->sendError('Unauthorised.', ['error' => 'Unauthorised'], 401);
        }
    }

    public function logout(Request $request)
    {
        auth('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['status' => true, 'message' => 'logged out']);
    }

    public function me()
    {
        return response()->json(['status' => true, 'user' => auth()->user(), 'message' => 'User retrieved successfully.']);
    }
}
