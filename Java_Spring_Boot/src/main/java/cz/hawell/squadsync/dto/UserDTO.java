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
public class UserDTO {

    private int id;
    private String userName;
    private String email;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
}
