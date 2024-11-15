package kb.report.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import kb.report.api.request.NoticeCreateRequest;
import kb.report.api.response.NoticeResponse;
import kb.report.internal.service.Notice.NoticeService;  // 수정된 부분
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
public class NoticeController {
    private final NoticeService noticeService;

    // 공지사항 등록
    @Operation(summary = "공지사항 등록", description = "관리자가 공지사항을 등록합니다.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "공지사항 등록 성공",
                    content = @Content(schema = @Schema(implementation = NoticeResponse.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "잘못된 요청"
            )
    })
    @PostMapping("api/v1/kickboard/admin/notice/create")
    public ResponseEntity<?> createNotice(
            @Parameter(description = "공지사항 정보", required = true, content = @Content(mediaType = "application/json", schema = @Schema(implementation = NoticeCreateRequest.class)))
            @RequestBody @Valid NoticeCreateRequest request) {

        // NoticeCreateRequest에서 title과 content 추출
        String title = request.getTitle();
        String content = request.getContent();

        // NoticeService.createNotice 메소드 호출
        NoticeResponse.Response response = noticeService.createNotice(title, content);  // 반환 타입이 Response임
        NoticeResponse.Data data = response.getData();  // Response에서 Data 추출

        // Response 객체를 ApiResponse.success로 반환
        return ResponseEntity.ok(kb.core.dto.ApiResponse.success(response));
    }

    // 공지사항 목록 조회
    @Operation(summary = "공지사항 목록 조회", description = "모든 공지사항 목록을 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "공지사항 목록 조회 성공", content = @Content(schema = @Schema(implementation = NoticeResponse.class)))
    })
    @GetMapping("api/v1/kickboard/admin/notice/notices")
    public ResponseEntity<?> getNotices() {
        // NoticeService에서 공지사항 목록을 가져오는 메소드 호출
        List<NoticeResponse.Response> responseList = noticeService.getNotices();  // 반환 타입이 Response 리스트

        // ApiResponse.success 메소드에 List<NoticeResponse.Response>를 전달
        return ResponseEntity.ok(kb.core.dto.ApiResponse.success(responseList));
    }
}

