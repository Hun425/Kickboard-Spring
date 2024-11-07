package kb.collection.api.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import kb.collection.internal.domain.CollectionProcessStatus;
import kb.collection.internal.domain.CollectionStatus;
import org.springframework.web.multipart.MultipartFile;

/**
 * 수거 상태 업데이트 DTO
 * @since JDK21
 * @author 채기훈
 */
public record CollectionStatusUpdateRequest(
        @NotNull(message = "상태는 필수입니다.") CollectionStatus collectionStatus,
        @NotNull(message = "신고 ID는 필수입니다.") Long reportId,
        @NotNull(message = "처리상태는 필수입니다.") CollectionProcessStatus processStatus,
        @Schema(type = "string", format = "binary")
        MultipartFile photo

) {}