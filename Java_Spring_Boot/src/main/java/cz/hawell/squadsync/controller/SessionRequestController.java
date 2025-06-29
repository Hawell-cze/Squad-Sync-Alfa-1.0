package cz.hawell.squadsync.controller;

import cz.hawell.squadsync.RequestType;
import cz.hawell.squadsync.dto.SessionRequestDTO;
import cz.hawell.squadsync.service.SessionRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
//@RequiredArgsConstructor
public class SessionRequestController {

    private final SessionRequestService service;

    public SessionRequestController(SessionRequestService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<SessionRequestDTO> createRequest(@RequestParam int userId,
                                                           @RequestParam String sessionToken,
                                                           @RequestParam RequestType type) {
        return ResponseEntity.ok(service.createRequest(userId, sessionToken, type));
    }

    @GetMapping("/session/{token}")
    public ResponseEntity<List<SessionRequestDTO>> getRequestsBySession(@PathVariable String token) {
        return ResponseEntity.ok(service.getRequestsBySession(token));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<SessionRequestDTO> updateStatus(@PathVariable int id,
                                                          @RequestParam String newStatus) {
        return ResponseEntity.ok(service.updateRequestStatus(id, newStatus));
    }
}
