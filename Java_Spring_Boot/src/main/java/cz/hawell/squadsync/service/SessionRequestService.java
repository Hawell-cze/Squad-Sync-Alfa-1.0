package cz.hawell.squadsync.service;

import cz.hawell.squadsync.RequestType;
import cz.hawell.squadsync.dto.SessionRequestDTO;
import cz.hawell.squadsync.entity.SessionRequestsEntity;
import cz.hawell.squadsync.entity.SessionsEntity;
import cz.hawell.squadsync.entity.UsersEntity;
import cz.hawell.squadsync.mapper.SessionRequestMapper;
import cz.hawell.squadsync.repository.SessionRequestsRepository;
import cz.hawell.squadsync.repository.SessionsRepository;
import cz.hawell.squadsync.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
//@RequiredArgsConstructor
public class SessionRequestService {

    private final SessionRequestsRepository repository;
    private final UsersRepository usersRepository;
    private final SessionsRepository sessionsRepository;
    private final SessionRequestMapper mapper;

    public SessionRequestService(SessionRequestsRepository repository, UsersRepository usersRepository, SessionsRepository sessionsRepository, SessionRequestMapper mapper) {
        this.repository = repository;
        this.usersRepository = usersRepository;
        this.sessionsRepository = sessionsRepository;
        this.mapper = mapper;
    }

    public SessionRequestDTO createRequest(int userId, String sessionToken, RequestType type) {
        UsersEntity user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        SessionsEntity session = sessionsRepository.findByToken(sessionToken)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        SessionRequestsEntity entity = new SessionRequestsEntity();
        entity.setUser(user);
        entity.setSession(session);
        entity.setRequestType(type);
        entity.setRequestStatus("PENDING");
        entity.setRequestedAt(LocalDateTime.now());

        return mapper.toDto(repository.save(entity));
    }

    public List<SessionRequestDTO> getRequestsBySession(String token) {
        return repository.findBySession_Token(token)
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    public SessionRequestDTO updateRequestStatus(int requestId, String newStatus) {
        SessionRequestsEntity request = repository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setRequestStatus(newStatus);
        request.setProcessedAt(LocalDateTime.now());
        return mapper.toDto(repository.save(request));
    }
}
