package cz.hawell.squadsync.mapper;

import cz.hawell.squadsync.dto.SessionCreateRequestDTO;
import cz.hawell.squadsync.dto.SessionDTO;
import cz.hawell.squadsync.dto.SessionResponseDTO;
import cz.hawell.squadsync.entity.SessionsEntity;
import org.codehaus.plexus.component.annotations.Component;
import org.mapstruct.*;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface SessionMapper {

    @Mapping(target = "commanderUserName", source = "commander.userName")
    SessionResponseDTO toDto(SessionsEntity entity);

    SessionsEntity fromCreateDto(SessionCreateRequestDTO dto);
}

