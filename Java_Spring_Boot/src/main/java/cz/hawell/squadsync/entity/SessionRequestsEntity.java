package cz.hawell.squadsync.entity;

import cz.hawell.squadsync.RequestType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity(name = "session_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SessionRequestsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    private SessionsEntity session;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UsersEntity user;

    @Enumerated(EnumType.STRING)
    private RequestType requestType; // JOIN, COMMAND, KICK, LEAVE...

    private String requestStatus; // např. PENDING, APPROVED, REJECTED
    private LocalDateTime requestedAt;
    private LocalDateTime processedAt;
}

