package kb.admin.internal.service;

import kb.admin.internal.domain.Notice;
import kb.admin.internal.repository.NoticeRepository;
import kb.admin.api.response.AdminNoticeResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminNoticeService {

    private final NoticeRepository noticeRepository;

    public AdminNoticeService(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    // 공지사항 목록 조회
    public List<AdminNoticeResponse> getAllNotices() {
        List<Notice> notices = noticeRepository.findAll();
        return notices.stream()
                .map(AdminNoticeResponse::from)
                .collect(Collectors.toList());
    }

    // 공지사항 상세 조회
    public AdminNoticeResponse getNoticeById(Long noticeId) {
        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new RuntimeException("Notice not found"));
        return AdminNoticeResponse.from(notice);
    }

    // 공지사항 등록
    @Transactional
    public AdminNoticeResponse createNotice(String title, String content, Long userId) {
        Notice newNotice = new Notice(title, content, userId);
        Notice savedNotice = noticeRepository.save(newNotice);
        return AdminNoticeResponse.from(savedNotice);
    }

    // 공지사항 삭제
    @Transactional
    public void deleteNotice(Long noticeId) {
        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new RuntimeException("Notice not found"));
        noticeRepository.delete(notice);
    }
}
