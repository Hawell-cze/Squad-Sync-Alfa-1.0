package cz.hawell.squadsync.controller;

import cz.hawell.squadsync.dto.LoginRequestDTO;
import cz.hawell.squadsync.dto.LoginResponseDTO;
import cz.hawell.squadsync.dto.UserRegistrationDTO;
import cz.hawell.squadsync.dto.UserResponseDTO;
import cz.hawell.squadsync.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
        return ResponseEntity.ok(userService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(@RequestBody UserRegistrationDTO request) {
        return ResponseEntity.ok(userService.register(request));
    }
}
