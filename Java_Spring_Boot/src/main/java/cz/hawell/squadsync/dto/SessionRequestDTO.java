package cz.hawell.squadsync.dto;

import cz.hawell.squadsync.RequestType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SessionRequestDTO {
    private int id;
    private int userId;
    private String userName;
    private String sessionToken;
    private RequestType requestType;
    private String requestStatus;
    private LocalDateTime requestedAt;
    private LocalDateTime processedAt;
}
