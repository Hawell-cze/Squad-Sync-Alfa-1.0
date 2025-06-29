package cz.hawell.squadsync.service;

import cz.hawell.squadsync.dto.SessionCreateRequestDTO;
import cz.hawell.squadsync.dto.SessionDTO;
import cz.hawell.squadsync.dto.SessionResponseDTO;
import cz.hawell.squadsync.entity.SessionUserStatusesEntity;
import cz.hawell.squadsync.entity.SessionsEntity;
import cz.hawell.squadsync.entity.UsersEntity;
import cz.hawell.squadsync.mapper.SessionMapper;
import cz.hawell.squadsync.repository.SessionUserStatusesRepository;
import cz.hawell.squadsync.repository.SessionsRepository;
import cz.hawell.squadsync.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
//@RequiredArgsConstructor
public class SessionService {

    private final SessionsRepository sessionsRepository;
    private final UsersRepository usersRepository;
    private final SessionMapper sessionMapper;
    private final SessionUserStatusesRepository statusesRepository;

    public SessionService(SessionsRepository sessionsRepository, UsersRepository usersRepository, SessionMapper sessionMapper, SessionUserStatusesRepository statusesRepository) {
        this.sessionsRepository = sessionsRepository;
        this.usersRepository = usersRepository;
        this.sessionMapper = sessionMapper;
        this.statusesRepository = statusesRepository;
    }

    public SessionResponseDTO createSession(SessionCreateRequestDTO dto) {
        UsersEntity commander = usersRepository.findById(dto.getCommanderId())
                .orElseThrow(() -> new RuntimeException("Commander not found"));



        SessionsEntity session = new SessionsEntity();
        session.setSessionName(dto.getSessionName());
        session.setCommander(commander);
        session.setToken(generateUniqueToken());
        session.setCreatedAt(LocalDateTime.now());

        SessionsEntity saved = sessionsRepository.save(session);

        SessionUserStatusesEntity commanderStatus = new SessionUserStatusesEntity();
        commanderStatus.setUser(commander);
        commanderStatus.setSession(saved); // 👉 správné jméno proměnné
        commanderStatus.setStatus("JOINED");
        commanderStatus.setChangedAt(LocalDateTime.now());

        statusesRepository.save(commanderStatus);

        return sessionMapper.toDto(saved);
    }

    public SessionResponseDTO getByToken(String token) {
        return sessionsRepository.findByToken(token)
                .map(sessionMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Session not found"));
    }

    public List<SessionResponseDTO> getAllSessions() {
        return sessionsRepository.findAll().stream()
                .map(sessionMapper::toDto)
                .toList();
    }

    public List<SessionResponseDTO> getSessionsByCommander(int commanderId) {
        return sessionsRepository.findByCommander_Id(commanderId).stream()
                .map(sessionMapper::toDto)
                .toList();
    }

    public List<SessionResponseDTO> getSessionsByUser(int userId) {
        List<SessionUserStatusesEntity> statuses = statusesRepository.findByUser_Id(userId);
        return statuses.stream()
                .map(status -> status.getSession())
                .distinct()
                .map(sessionMapper::toDto)
                .toList();
    }


    public String generateToken() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        SecureRandom random = new SecureRandom();
        StringBuilder token = new StringBuilder();

        for (int i = 0; i < 7; i++) {
            int index = random.nextInt(chars.length());
            token.append(chars.charAt(index));
        }

        return token.toString();
    }
    public String generateUniqueToken() {
        String token;
        do {
            token = generateToken();
        } while (sessionsRepository.findByToken(token).isPresent());
        return token;
    }
}
