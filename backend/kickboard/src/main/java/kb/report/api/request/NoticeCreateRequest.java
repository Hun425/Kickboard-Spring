package kb.report.api.request;

import jakarta.validation.constraints.NotBlank;

public class NoticeCreateRequest {

    /**
     * 공지사항 Request
     * @since JDK21
     * @author 정소영
     */

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}

