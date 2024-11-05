package kb.collection.api.response;

import kb.collection.internal.domain.CollectionRequest;
import kb.collection.internal.domain.CollectionStatus;

import java.time.LocalDateTime;
/**
 * 수거 요청 응답 DTO
 * @since JDK21
 * @author 채기훈
 */
public record CollectionRequestResponse(
        Long requestId,
        Long reportId,
        CollectionStatus status,
        String photoUrl,
        LocalDateTime requestCreatedAt,
        LocalDateTime completedUpdateAt
) {
    public static CollectionRequestResponse from(CollectionRequest request) {
        return new CollectionRequestResponse(
                request.getRequestId(),
                request.getReport().getReportId(),
                request.getStatus(),
                request.getPhotoUrl(),
                request.getRequestedCreatedAt(),
                request.getCompletedUpdatedAt()
        );
    }
}
