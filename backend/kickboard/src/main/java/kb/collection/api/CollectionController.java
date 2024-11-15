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
import org.springframework.security.core.userdetails.UserDetails;
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
    @PostMapping( "/{reportId}")
    public ResponseEntity<ApiResponse<CollectionRequestResponse>> createRequest(
            @PathVariable Long reportId,
            @AuthenticationPrincipal UserPrincipal user) {
        return ResponseEntity.ok(ApiResponse.success(
                collectionRequestService.createRequest(reportId)));
    }

    @LocationAuth
    @Operation(summary = "수거 요청 상태 업데이트")
    @PatchMapping("/{requestId}")
    public ResponseEntity<ApiResponse<CollectionRequestResponse>> updateStatus(
            @PathVariable Long requestId,
            CollectionStatusUpdateRequest request,
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



    @Operation(summary = "담당 구역 전체 수거 요청 조회")
    @GetMapping
    public ResponseEntity<ApiResponse<List<CollectionRequestResponse>>> getMyDistrictRequests(
            @AuthenticationPrincipal UserPrincipal user
    ) {
        if (user == null) {
            throw new IllegalStateException("인증 정보가 없습니다.");
        }

        List<CollectionRequestResponse> response = collectionRequestService
                .getAllDistrictCollectionRequests(user.userId());  // userId 직접 사용

        return ResponseEntity.ok(ApiResponse.success(response));
    }
}