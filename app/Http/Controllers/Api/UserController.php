<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class UserController extends BaseController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = User::all();
        return $this->sendResponse(UserResource::collection($users), 'Users retrieved successfully.');
    }

    public function count()
    {
        $users = User::all()->count();
        $last_user = User::latest()->first();
        $last_user['name'] = $last_user->firstname . (($last_user->lastname) ? " " . $last_user->lastname : "");
        return $this->sendResponse(["count" => $users, "last" => $last_user], 'Users counted successfully.');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'firstname' => 'required',
            'lastname' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed',
        ]);

        if ($validator->fails()){
            return $this->sendError('Validation Error.', $validator->errors());
        }

        $input = $request->all();
        $input['password'] = bcrypt($input['password']);

        $user = User::create($input);

        $name = $user->firstname . (($user->lastname) ? " " . $user->lastname : "");
        $success['name'] =  $name;
        $success['email'] =  $user->email;

        return $this->sendResponse($success, "User $name registered successfully.");
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        return $this->sendResponse([
            'email' => $user->email,
            'name' => $user->firstname . " " . $user->lastname,
            'firstname' => $user->firstname,
            'lastname' => $user->lastname,
        ], '');
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $user = User::find($id);
        return $this->sendResponse($user, '');
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'firstname' => 'required',
            'lastname' => 'required',
            'email' => 'required|email',
        ]);

        if ($validator->fails()) return $this->sendError('Validation Error.', $validator->errors());

        $user = User::find($id);
        $user->firstname = $request->input('firstname');
        $user->lastname = $request->input('lastname');
        $user->email = $request->input('email');
        // $user->password = bcrypt($request->input('password'));
        $user->update();

        $success = [
            'email' => $user->email,
            'name' => $user->firstname . " " . $user->lastname,
            'firstname' => $user->firstname,
            'lastname' => $user->lastname,
        ];

        return $this->sendResponse($success, 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        $user->delete();
        return $this->sendResponse([], 'User deleted successfully.');
    }
}
