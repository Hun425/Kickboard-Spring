package kb.report.api.response;

public class NoticeResponse {

    /**
     * 공지사항 Response
     * @since JDK21
     * @author 정소영
     */

    // 공지사항 응답 객체
    public static class Response {
        private boolean success;
        private Data data;
        private String errorMessage;

        // 생성자, getter, setter
        public Response(boolean success, Data data, String errorMessage) {
            this.success = success;
            this.data = data;
            this.errorMessage = errorMessage;
        }

        public boolean isSuccess() {
            return success;
        }

        public Data getData() {
            return data;
        }

        public String getErrorMessage() {
            return errorMessage;
        }
    }

    // 공지사항 데이터 객체
    public static class Data {
        private Long id;
        private String title;
        private String content;

        // 생성자, getter, setter
        public Data(Long id, String title, String content) {
            this.id = id;
            this.title = title;
            this.content = content;
        }

        public Long getId() {
            return id;
        }

        public String getTitle() {
            return title;
        }

        public String getContent() {
            return content;
        }
    }
}
