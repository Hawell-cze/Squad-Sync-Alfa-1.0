package cz.hawell.squadsync.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity(name = "session_user_statuses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SessionUserStatusesEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UsersEntity user;

    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    private SessionsEntity session;

    private String status; // např. "PENDING", "JOINED", "REJECTED"
    private LocalDateTime changedAt;
}


