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
public class SessionResponseDTO {
    private String token;
    private String sessionName;
    private String commanderUserName;
    private LocalDateTime createdAt;
}
