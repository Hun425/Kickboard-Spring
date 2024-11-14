package kb.admin.api.response;

import kb.admin.internal.domain.Notice;
import lombok.Getter;

@Getter
public class AdminNoticeResponse {
    private Long noticeId;
    private Long userId;
    private String title;
    private String content;

    public static AdminNoticeResponse from(Notice notice) {
        AdminNoticeResponse response = new AdminNoticeResponse();
        response.noticeId = notice.getNoticeId();
        response.userId = notice.getUserId();
        response.title = notice.getTitle();
        response.content = notice.getContent();
        return response;
    }
}
