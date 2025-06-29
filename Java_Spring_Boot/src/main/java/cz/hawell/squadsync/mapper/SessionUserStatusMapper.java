package cz.hawell.squadsync.mapper;

import cz.hawell.squadsync.dto.SessionUserStatusDTO;
import cz.hawell.squadsync.entity.SessionUserStatusesEntity;
import org.mapstruct.*;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface SessionUserStatusMapper {

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "userName", source = "user.userName")
    @Mapping(target = "sessionToken", source = "session.token")
    SessionUserStatusDTO toDto(SessionUserStatusesEntity entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "session", ignore = true)
    SessionUserStatusesEntity toEntity(SessionUserStatusDTO dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    SessionUserStatusesEntity updateEntity(SessionUserStatusDTO dto, @MappingTarget SessionUserStatusesEntity entity);
}
