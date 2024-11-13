package kb.report.api.response;

import kb.report.internal.domain.Report;
import lombok.Getter;

import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;

@Getter
public class AdminReportResponse {
    private String reportId;
    private String companyName;
    private String serialNumber;
    private String address;
    private Double latitude;
    private Double longitude;
    private String category;
    private String adminStatus; // 수거요청/수거완료
    private List<String> images;
    private String createdAt;

    public static AdminReportResponse from(Report report) {
        AdminReportResponse response = new AdminReportResponse();
        response.reportId = report.getReportId().toString();
        response.companyName = report.getKickboard().getCompany().getName();
        response.serialNumber = report.getKickboard().getSerialNumber();
        response.address = report.getAddress();
        response.latitude = report.getLatitude();
        response.longitude = report.getLongitude();
        response.category = report.getCategory().getName(); // category의 name 필드 사용
        response.adminStatus = report.getStatus().getDescription(); // 상태 이름 가져오기
        response.images = Arrays.asList(report.getPhotoUrl().split(","));
        response.createdAt = report.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        return response;
    }
}
