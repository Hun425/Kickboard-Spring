package kb.collection.api.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

/**
 * 수거 요청 DTO
 * @since JDK21
 * @author 채기훈
 */
public record CollectionRequestCreateRequest(
        Long requestId
) {}