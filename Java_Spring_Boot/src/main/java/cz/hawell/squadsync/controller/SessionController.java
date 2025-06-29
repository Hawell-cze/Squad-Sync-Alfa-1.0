package cz.hawell.squadsync.controller;

import cz.hawell.squadsync.dto.SessionCreateRequestDTO;
import cz.hawell.squadsync.dto.SessionDTO;
import cz.hawell.squadsync.dto.SessionResponseDTO;
import cz.hawell.squadsync.service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
//@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;

    @PostMapping
    public ResponseEntity<SessionResponseDTO> createSession(@RequestBody SessionCreateRequestDTO requestDto) {
        return ResponseEntity.ok(sessionService.createSession(requestDto));
    }


    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @GetMapping("/{token}")
    public ResponseEntity<SessionResponseDTO> getSession(@PathVariable String token) {
        return ResponseEntity.ok(sessionService.getByToken(token));
    }

    @GetMapping
    public ResponseEntity<List<SessionResponseDTO>> getAllSessions() {
        return ResponseEntity.ok(sessionService.getAllSessions());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SessionResponseDTO>> getSessionsForUser(@PathVariable int userId) {
        return ResponseEntity.ok(sessionService.getSessionsByUser(userId));
    }

    @GetMapping("/commander/{commanderId}")
    public ResponseEntity<List<SessionResponseDTO>> getSessionsByCommander(@PathVariable int commanderId) {
        return ResponseEntity.ok(sessionService.getSessionsByCommander(commanderId));
    }
}
