package kb.admin.api;

import kb.admin.api.response.AdminNoticeResponse;
import kb.admin.internal.service.AdminNoticeService;
import kb.core.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/kickboard/admin/notice")
public class AdminNoticeController {

    private final AdminNoticeService adminNoticeService;

    public AdminNoticeController(AdminNoticeService adminNoticeService) {
        this.adminNoticeService = adminNoticeService;
    }

    // 공지사항 목록 조회
    @GetMapping("/notices")
    public ResponseEntity<ApiResponse> getNotices() {
        List<AdminNoticeResponse> notices = adminNoticeService.getAllNotices();
        return ResponseEntity.ok(ApiResponse.success(notices));
    }

    // 공지사항 상세 조회
    @GetMapping("/notices/{noticeId}")
    public ResponseEntity<ApiResponse> getNoticeById(@PathVariable Long noticeId) {
        AdminNoticeResponse notice = adminNoticeService.getNoticeById(noticeId);
        return ResponseEntity.ok(ApiResponse.success(notice));
    }

    // 공지사항 등록
    @PostMapping("/create")
    public ResponseEntity<ApiResponse> createNotice(@RequestBody AdminNoticeResponse request) {
        AdminNoticeResponse createdNotice = adminNoticeService.createNotice(request.getTitle(), request.getContent(), 1L); // 1L은 예시로, 실제로는 로그인한 유저의 ID가 필요함
        return ResponseEntity.ok(ApiResponse.success(createdNotice));
    }

    // 공지사항 삭제
    @DeleteMapping("/{noticeId}/delete")
    public ResponseEntity<ApiResponse> deleteNotice(@PathVariable Long noticeId) {
        adminNoticeService.deleteNotice(noticeId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}
