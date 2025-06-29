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
public class SessionUserStatusDTO {

    private int id;
    private int userId;
    private String userName;
    private String sessionToken;
    private String status;
    private LocalDateTime changedAt;
}
