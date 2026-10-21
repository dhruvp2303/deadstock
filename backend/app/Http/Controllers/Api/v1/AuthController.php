<?php

namespace App\Http\Controllers\Api\v1;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Traits\ApiResponse;
use App\Models\Company;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    use ApiResponse;

    public function register(RegisterRequest $request): JsonResponse
    {
        $company = Company::create([
            'name' => $request->company_name,
            'industry' => $request->industry,
            'is_demo' => false,
        ]);

        $user = User::create([
            'company_id' => $company->id,
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'admin',
            'phone' => $request->phone,
            'is_demo' => false,
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
        ]);

        \App\Models\Warehouse::firstOrCreate([
            'company_id' => $company->id,
            'name' => 'Primary Distribution Facility',
        ], [
            'user_id' => $user->id,
            'city' => 'Mumbai',
            'state' => 'Maharashtra',
            'country' => 'India',
            'capacity_sqft' => 25000,
        ]);

        \Illuminate\Support\Facades\Log::info("User Registered & Login Recorded: {$user->email} [User ID: {$user->id}] from IP: {$request->ip()}");

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->successResponse([
            'user' => $user->load('company'),
            'token' => $token,
            'token_type' => 'Bearer',
        ], 'User registered successfully', 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return $this->errorResponse('Invalid email or password', null, 401);
        }

        $user = User::where('email', $request->email)->with('company')->firstOrFail();
        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
        ]);
        \Illuminate\Support\Facades\Log::info("User Login Recorded: {$user->email} [User ID: {$user->id}] from IP: {$request->ip()}");

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->successResponse([
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer',
        ], 'Login successful');
    }

    public function me(Request $request): JsonResponse
    {
        $user = auth('sanctum')->user() ?? $request->user();
        if (!$user) {
            return $this->errorResponse('Unauthenticated', null, 401);
        }

        return $this->successResponse(
            $user->load('company'),
            'Authenticated user retrieved successfully'
        );
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = auth('sanctum')->user() ?? $request->user();
        if (!$user) {
            return $this->errorResponse('Unauthenticated', null, 401);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'nullable|string|max:30',
            'profile_image' => 'nullable|string',
            'role' => 'nullable|string|max:50',
            'company_name' => 'nullable|string|max:255',
            'industry' => 'nullable|string|max:255',
            'location_city' => 'nullable|string|max:255',
        ]);

        if (isset($validated['name'])) {
            $user->name = $validated['name'];
        }
        if (array_key_exists('phone', $validated)) {
            $user->phone = $validated['phone'];
        }
        if (array_key_exists('profile_image', $validated)) {
            $user->profile_image = $validated['profile_image'];
        }
        if (isset($validated['role'])) {
            $user->role = $validated['role'];
        }
        $user->save();

        if ($user->company) {
            if (!empty($validated['company_name'])) {
                $user->company->name = $validated['company_name'];
            }
            if (!empty($validated['industry'])) {
                $user->company->industry = $validated['industry'];
            }
            if (!empty($validated['location_city'])) {
                $user->company->location_city = $validated['location_city'];
            }
            $user->company->save();
        }

        \Illuminate\Support\Facades\Log::info("User Profile Updated: {$user->email} [User ID: {$user->id}]");

        return $this->successResponse(
            $user->fresh()->load('company'),
            'Profile updated successfully'
        );
    }

    public function changePassword(Request $request): JsonResponse
    {
        $user = auth('sanctum')->user() ?? $request->user();
        if (!$user) {
            return $this->errorResponse('Unauthenticated', null, 401);
        }

        $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if (!Hash::check($request->current_password, $user->password)) {
            return $this->errorResponse('Current password does not match.', null, 422);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        \Illuminate\Support\Facades\Log::info("User Password Changed: {$user->email} [User ID: {$user->id}]");

        return $this->successResponse(null, 'Password changed successfully');
    }

    public function logout(Request $request): JsonResponse
    {
        $user = auth('sanctum')->user() ?? $request->user();
        if ($user) {
            \Illuminate\Support\Facades\Log::info("User Logout Recorded: {$user->email} [User ID: {$user->id}]");
            if (method_exists($user, 'currentAccessToken')) {
                $token = $user->currentAccessToken();
                if ($token && method_exists($token, 'delete')) {
                    $token->delete();
                }
            }
        }

        return $this->successResponse(null, 'Successfully logged out');
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $token = Str::random(60);

        \Illuminate\Support\Facades\DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => Hash::make($token),
                'created_at' => now(),
            ]
        );

        return $this->successResponse([
            'email' => $request->email,
            'reset_token' => $token, // In production, this would be emailed via mailer
            'expires_in' => '60 minutes',
        ], 'Password reset token generated. Please follow the instructions sent to your email.');
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $record = \Illuminate\Support\Facades\DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$record || !Hash::check($request->token, $record->token)) {
            return $this->errorResponse('Invalid or expired password reset token.', null, 400);
        }

        // Check if token is older than 60 minutes
        if (now()->diffInMinutes(\Carbon\Carbon::parse($record->created_at)) > 60) {
            \Illuminate\Support\Facades\DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return $this->errorResponse('Password reset token has expired. Please request a new one.', null, 400);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $user->update([
            'password' => Hash::make($request->password),
        ]);

        \Illuminate\Support\Facades\DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return $this->successResponse(null, 'Password has been reset successfully. You can now login with your new credentials.');
    }

    public function demoSession(Request $request): JsonResponse
    {
        // Run comprehensive DemoDataSeeder to ensure all features have full showcase datasets
        (new \Database\Seeders\DemoDataSeeder())->run();

        $demoUser = User::where('email', 'demo-explorer@deadstock.internal')->firstOrFail();


        $token = $demoUser->createToken('demo_token')->plainTextToken;
        $userPayload = $demoUser->fresh()->load('company')->toArray();
        $userPayload['is_demo'] = true;

        return $this->successResponse([
            'user' => $userPayload,
            'token' => $token,
            'token_type' => 'Bearer',
            'is_demo' => true,
        ], 'Demo exploration session activated');
    }
}
