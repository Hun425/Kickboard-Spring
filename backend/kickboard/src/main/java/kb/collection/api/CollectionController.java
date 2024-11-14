package kb.collection.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import kb.collection.api.request.CollectionRequestCreateRequest;
import kb.collection.api.request.CollectionStatusUpdateRequest;
import kb.collection.api.response.CollectionRequestResponse;
import kb.collection.internal.domain.CollectionStatus;
import kb.collection.internal.service.CollectionRequestService;
import kb.core.dto.ApiResponse;
import kb.user.internal.config.LocationAuth;
import kb.user.internal.domain.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
/**
 * 수거 요청 컨트롤러
 * @since JDK21
 * @author 채기훈
 */
@Tag(name = "Collection", description = "수거 요청 API")
@Controller
@RequestMapping("/kickboard/collections")
@RequiredArgsConstructor
public class CollectionController {
    private final CollectionRequestService collectionRequestService;

    @LocationAuth
    @Operation(summary = "수거 요청 생성")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE,value = "/{reportId}")
    public ResponseEntity<ApiResponse<CollectionRequestResponse>> createRequest(
            @PathVariable Long reportId,
            @ModelAttribute CollectionRequestCreateRequest request,
            @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(ApiResponse.success(
                collectionRequestService.createRequest(reportId,request)));
    }

    @LocationAuth
    @Operation(summary = "수거 요청 상태 업데이트")
    @PatchMapping(
            value = "/{requestId}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ApiResponse<CollectionRequestResponse>> updateStatus(
            @PathVariable Long requestId,
            @ModelAttribute CollectionStatusUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(ApiResponse.success(
                collectionRequestService.updateStatus(requestId,request)));
    }

    @LocationAuth
    @Operation(summary = "수거 요청 조회")
    @GetMapping("/{requestId}")
    public ResponseEntity<ApiResponse<CollectionRequestResponse>> getRequest(
            @PathVariable Long requestId,
            @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(ApiResponse.success(
                collectionRequestService.getRequest(requestId)));
    }

    @LocationAuth
    @Operation(summary = "상태별 수거 요청 목록 조회")
    @GetMapping
    public ResponseEntity<ApiResponse<List<CollectionRequestResponse>>> getRequestsByStatus(
            @RequestParam CollectionStatus status,
            @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(ApiResponse.success(
                collectionRequestService.getRequestsByStatus(status)));
    }
}