package cz.hawell.squadsync.service;

import cz.hawell.squadsync.dto.SessionUserStatusDTO;
import cz.hawell.squadsync.entity.SessionUserStatusesEntity;
import cz.hawell.squadsync.entity.SessionsEntity;
import cz.hawell.squadsync.entity.UsersEntity;
import cz.hawell.squadsync.mapper.SessionUserStatusMapper;
import cz.hawell.squadsync.repository.SessionUserStatusesRepository;
import cz.hawell.squadsync.repository.SessionsRepository;
import cz.hawell.squadsync.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
//@RequiredArgsConstructor
public class SessionUserStatusService {

    private final SessionUserStatusesRepository repository;
    private final UsersRepository usersRepository;
    private final SessionsRepository sessionsRepository;
    private final SessionUserStatusMapper mapper;

    public SessionUserStatusService(SessionUserStatusesRepository repository, UsersRepository usersRepository, SessionsRepository sessionsRepository, SessionUserStatusMapper mapper) {
        this.repository = repository;
        this.usersRepository = usersRepository;
        this.sessionsRepository = sessionsRepository;
        this.mapper = mapper;
    }

    public SessionUserStatusDTO addUserToSession(int userId, String sessionToken, String status) {
        UsersEntity user = usersRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        SessionsEntity session = sessionsRepository.findByToken(sessionToken)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        Optional<SessionUserStatusesEntity> existing = repository.findByUser_IdAndSession_Token(userId, sessionToken);
        if (existing.isPresent()) {
            // už existuje → vrátíme existující DTO
            return mapper.toDto(existing.get());
        }

        SessionUserStatusesEntity entity = new SessionUserStatusesEntity();
        entity.setUser(user);
        entity.setSession(session);
        entity.setStatus(status);
        entity.setChangedAt(LocalDateTime.now());

        return mapper.toDto(repository.save(entity));
    }


    public List<SessionUserStatusDTO> getUsersInSession(String sessionToken) {
        return repository.findBySession_Token(sessionToken)
                .stream()
                .map(mapper::toDto)
                .toList();
    }

    public SessionUserStatusDTO updateUserStatus(int userId, String sessionToken, String status) {
        SessionUserStatusesEntity entity = repository.findByUser_IdAndSession_Token(userId, sessionToken)
                .orElseThrow(() -> new RuntimeException("Session user not found"));

        entity.setStatus(status);
        entity.setChangedAt(LocalDateTime.now());

        SessionUserStatusesEntity updated = repository.save(entity);
        return mapper.toDto(updated);
    }



}
