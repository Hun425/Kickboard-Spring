package kb.report.api.request;

import lombok.Data;
import jakarta.validation.constraints.NotNull;

public class ReportCreateRequest {

    @NotNull(message = "회사 이름은 필수 입력 사항입니다.")
    private String companyName;  // 킥보드 회사명

    @NotNull(message = "킥보드 시리얼 번호는 필수 입력 사항입니다.")
    private String serialNumber;  // 킥보드 시리얼 번호

    @NotNull(message = "위도는 필수 입력 사항입니다.")
    private Double latitude;  // 위도

    @NotNull(message = "경도는 필수 입력 사항입니다.")
    private Double longitude;  // 경도

    @NotNull(message = "주소는 필수 입력 사항입니다.")
    private String address;  // 주소

    @NotNull(message = "신고 카테고리는 필수 입력 사항입니다.")
    private Long category;  // 신고 카테고리의 ID

    private String description;  // 신고 내용 (선택 사항)
}
