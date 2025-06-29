package cz.hawell.squadsync.service;

import cz.hawell.squadsync.dto.*;
import cz.hawell.squadsync.entity.UsersEntity;
import cz.hawell.squadsync.mapper.UserMapper;
import cz.hawell.squadsync.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;



@Service
//@RequiredArgsConstructor
public class UserService {

    private final UsersRepository usersRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();



    public UserService(UsersRepository usersRepository, UserMapper userMapper) {
        this.usersRepository = usersRepository;
        this.userMapper = userMapper;
    }

    public UserResponseDTO createUser(UserRegistrationDTO dto) {
        UsersEntity entity = new UsersEntity();
        entity.setUserName(dto.getUserName());
        entity.setEmail(dto.getEmail());
        entity.setPassword(passwordEncoder.encode(dto.getPassword()));
        entity.setCreatedAt(LocalDateTime.now());

        UsersEntity saved = usersRepository.save(entity);

        return new UserResponseDTO(saved.getId(), saved.getUserName(), saved.getEmail(), saved.getCreatedAt());
    }


    public UserDTO getUser(int id) {
        return usersRepository.findById(id)
                .map(userMapper::toDto)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<UserDTO> getAllUsers() {
        return usersRepository.findAll()
                .stream()
                .map(userMapper::toDto)
                .toList();
    }

    public LoginResponseDTO login(LoginRequestDTO request) {
        UsersEntity user = usersRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Uživatel nenalezen"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Neplatné přihlašovací údaje");
        }

        user.setLastLogin(LocalDateTime.now());
        usersRepository.save(user);

        return new LoginResponseDTO(user.getId(), user.getUserName(), user.getEmail());
    }

    public UserResponseDTO register(UserRegistrationDTO request) {
        if (usersRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("E-mail už je zaregistrovaný");
        }

        UsersEntity entity = new UsersEntity();
        entity.setUserName(request.getUserName());
        entity.setEmail(request.getEmail());
        entity.setPassword(passwordEncoder.encode(request.getPassword()));
        entity.setCreatedAt(LocalDateTime.now());

        UsersEntity saved = usersRepository.save(entity);
        return new UserResponseDTO(saved.getId(), saved.getUserName(), saved.getEmail(), saved.getCreatedAt());
    }
}
