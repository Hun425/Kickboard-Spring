package kb.report.internal.service.Notice;

import kb.report.internal.service.Notice.NoticeService;

import kb.report.api.response.NoticeResponse;
import kb.report.internal.domain.Notice;
import kb.report.internal.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 공지사항 서비스
 * @since JDK21
 */
@Service
@RequiredArgsConstructor
public class NoticeService {

    private final NoticeRepository noticeRepository;  // NoticeRepository 의존성 주입

    /**
     * 공지사항 등록
     * @param title 공지사항 제목
     * @param content 공지사항 내용
     * @return 공지사항 등록 결과
     */
    public NoticeResponse.Response createNotice(String title, String content) {
        // Notice 엔티티 생성
        Notice notice = Notice.builder()
                .title(title)
                .content(content)
                .build();

        // DB에 공지사항 저장
        Notice savedNotice = noticeRepository.save(notice);

        // 저장된 공지사항을 Response로 변환하여 반환
        NoticeResponse.Data data = new NoticeResponse.Data(savedNotice.getNoticeId(), savedNotice.getTitle(), savedNotice.getContent());
        return new NoticeResponse.Response(true, data, null);  // 성공 시 response 객체 반환
    }

    /**
     * 공지사항 목록 조회
     * @return 공지사항 목록
     */
    public List<NoticeResponse.Response> getNotices() {
        // DB에서 모든 공지사항 조회
        List<Notice> notices = noticeRepository.findAll();

        // 조회된 공지사항 리스트를 Response 객체로 변환하여 반환
        return notices.stream()
                .map(notice -> {
                    NoticeResponse.Data data = new NoticeResponse.Data(notice.getNoticeId(), notice.getTitle(), notice.getContent());
                    return new NoticeResponse.Response(true, data, null);
                })
                .collect(Collectors.toList());
    }
}
