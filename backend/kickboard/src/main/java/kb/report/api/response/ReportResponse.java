package kb.report.api.response;

import kb.report.internal.domain.Report;
import lombok.Data;

import java.util.Arrays;
import java.util.List;

/**
 * 신고 응답 dto
 * @since JDK21
 * @author 지예찬
 */
@Data
public class ReportResponse {
    private Long reportId;
    private String companyName;
    private String serialNumber;
    private String address;
    private Double latitude;
    private Double longitude;
    private String category;
    private String status;
    private List<String> images;
    private String descriptions;
    private String createdAt;

    public static ReportResponse from(Report report) {
        ReportResponse response = new ReportResponse();
        response.setReportId(report.getReportId());
        response.setCompanyName(report.getKickboard().getCompany().getName());
        response.setSerialNumber(report.getKickboard().getSerialNumber());
        response.setCategory(report.getCategory().getName()); // category의 name 필드 사용
        response.setAddress(report.getAddress());
        response.setLatitude(report.getLatitude());
        response.setLongitude(report.getLongitude());
        response.setCategory(report.getCategory().getName());
        response.setStatus(report.getStatus().name());
        response.setImages(Arrays.asList(report.getPhotoUrl().split(",")));
        response.setDescriptions(report.getContent());
        response.setCreatedAt(report.getCreatedAt().toString());
        return response;
    }
}
