package cz.hawell.squadsync.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SessionDTO {
    private String token;
    private String sessionName;
    private int commanderId;
    private String commanderUserName;
    private LocalDateTime createdAt;
}
