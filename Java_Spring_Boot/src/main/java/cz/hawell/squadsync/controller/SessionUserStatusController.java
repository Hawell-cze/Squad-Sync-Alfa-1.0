package cz.hawell.squadsync.controller;

import cz.hawell.squadsync.dto.SessionUserStatusDTO;
import cz.hawell.squadsync.service.SessionUserStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/session-users")
//@RequiredArgsConstructor
public class SessionUserStatusController {

    private final SessionUserStatusService service;

    public SessionUserStatusController(SessionUserStatusService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<SessionUserStatusDTO> addUser(@RequestParam int userId,
                                                        @RequestParam String sessionToken,
                                                        @RequestParam(defaultValue = "PENDING") String status) {
        return ResponseEntity.ok(service.addUserToSession(userId, sessionToken, status));
    }

    @PutMapping("/update-status")
    public ResponseEntity<SessionUserStatusDTO> updateStatus(@RequestParam int userId,
                                                             @RequestParam String sessionToken,
                                                             @RequestParam String status) {
        return ResponseEntity.ok(service.updateUserStatus(userId, sessionToken, status));
    }

    @GetMapping("/session/{token}")
    public ResponseEntity<List<SessionUserStatusDTO>> getUsers(@PathVariable String token) {
        return ResponseEntity.ok(service.getUsersInSession(token));
    }
}
