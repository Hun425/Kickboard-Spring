package kb.user.api.response;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 지역 DTO
 * @since JDK21
 * @author 채기훈
 */
@Schema(description = "지역 정보 응답")
public record LocationResponse(
        @Schema(description = "지역 키")
        Long locationId,

        @Schema(description = "지역명")
        String field
) {}
