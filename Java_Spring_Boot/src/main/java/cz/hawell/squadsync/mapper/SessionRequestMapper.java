package cz.hawell.squadsync.mapper;

import cz.hawell.squadsync.dto.SessionRequestDTO;
import cz.hawell.squadsync.entity.SessionRequestsEntity;
import org.mapstruct.*;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface SessionRequestMapper {

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "userName", source = "user.userName")
    @Mapping(target = "sessionToken", source = "session.token")
    SessionRequestDTO toDto(SessionRequestsEntity entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "session", ignore = true)
    SessionRequestsEntity toEntity(SessionRequestDTO dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    SessionRequestsEntity updateEntity(SessionRequestDTO dto, @MappingTarget SessionRequestsEntity entity);
}
