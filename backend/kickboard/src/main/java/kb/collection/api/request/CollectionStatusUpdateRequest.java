package kb.collection.api.request;

import jakarta.validation.constraints.NotNull;
import kb.collection.internal.domain.CollectionStatus;

/**
 * 수거 상태 업데이트 DTO
 * @since JDK21
 * @author 채기훈
 */
public record CollectionStatusUpdateRequest(
        @NotNull(message = "상태는 필수입니다.") CollectionStatus status
) {}