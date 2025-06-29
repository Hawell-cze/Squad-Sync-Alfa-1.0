package cz.hawell.squadsync.entity;

import cz.hawell.squadsync.SessionStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity(name = "sessions")
@Getter
@Setter
@NoArgsConstructor
public class SessionsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false, unique = true)
    private String token;

    private String sessionName;
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "commander_id")
    private UsersEntity commander;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SessionUserStatusesEntity> userStatuses = new ArrayList<>();

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SessionRequestsEntity> requests = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private SessionStatus status;
}

