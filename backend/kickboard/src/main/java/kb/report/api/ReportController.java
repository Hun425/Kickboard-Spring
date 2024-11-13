package kb.report.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import kb.report.api.request.ReportCreateRequest;
import kb.report.api.request.ReportStatusUpdateRequest;
import kb.report.api.response.AdminReportResponse;
import kb.report.api.response.ReportDetailResponse;
import kb.report.api.response.ReportResponse;
import kb.report.internal.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 신고 컨트롤러
 * @since JDK21
 * @author 지예찬
 */
@RestController
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;

    @Operation(summary = "신고자 신고 등록", description = "신고자가 킥보드 불법 주차를 신고합니다.")
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "신고 등록 성공",
                    content = @Content(schema = @Schema(implementation = ReportResponse.class))
            ),
    })
    @PostMapping("api/v1/kickboard/reports")
    public ResponseEntity<?> createReport(
            @Parameter(description = "신고 정보", required = true, content = @Content(mediaType = "application/json", schema = @Schema(implementation = ReportCreateRequest.class)))
            @RequestPart("report") ReportCreateRequest report,
            @Parameter(description = "신고 사진 (최대 2장)", required = false)
            @RequestPart(value = "image", required = false) MultipartFile[] images) {


        ReportResponse response = reportService.createReport(report, images);
        return ResponseEntity.ok(kb.core.dto.ApiResponse.success(response));
    }

    @Operation(summary = "신고자 신고 리스트 조회", description = "담당 구역(area)으로 신고 리스트를 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "신고 리스트 조회 성공", content = @Content(schema = @Schema(implementation = ReportResponse.class))),
    })
    @GetMapping("api/v1/kickboard/reports")
    public ResponseEntity<?> getReportsByArea(
            @Parameter(description = "담당 구역", required = false) @RequestParam("area") String area) {

        List<ReportResponse> reports = reportService.getReportsByArea(area);
        return ResponseEntity.ok(kb.core.dto.ApiResponse.success(reports));
    }

    @Operation(summary = "신고자 신고 세부 조회", description = "신고 ID로 특정 신고의 세부 정보를 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "신고 세부 조회 성공", content = @Content(schema = @Schema(implementation = ReportDetailResponse.class))),
    })
    @GetMapping("api/v1/kickboard/reports/{reportId}")
    public ResponseEntity<?> getReportDetail(
            @Parameter(description = "신고 ID", required = true) @PathVariable Long reportId) {

        ReportDetailResponse reportDetail = reportService.getReportDetail(reportId);
        return ResponseEntity.ok(kb.core.dto.ApiResponse.success(reportDetail));
    }

    @Operation(summary = "관리자 신고 목록 조회", description = "담당 구역(area)으로 신고 목록을 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "신고 목록 조회 성공", content = @Content(schema = @Schema(implementation = AdminReportResponse.class))),
    })
    @GetMapping("api/v1/kickboard/admin/reports")
    public ResponseEntity<?> adminGetReportsByArea(
            @Parameter(description = "담당 구역", required = true) @RequestParam("area") String area) {

        Map<String, List<AdminReportResponse>> reports = reportService.AdminGetReportsByArea(area);
        return ResponseEntity.ok(kb.core.dto.ApiResponse.success(reports));    }

    @Operation(summary = "관리자 신고 상세 조회", description = "serialNumber로 최신 신고를 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "신고 상세 조회 성공", content = @Content(schema = @Schema(implementation = AdminReportResponse.class)))
    })
    @GetMapping("api/v1/kickboard/admin/reports/{serialNumber}")
    public ResponseEntity<?> AdmingetReportsBySerialNumber(
            @Parameter(description = "serialNumber", required = true) @PathVariable String serialNumber) {

        List<AdminReportResponse> reportDetails = reportService.AdminGetReportsBySerialNumber(serialNumber);
        Map<String, Object> response = new HashMap<>();
        response.put("reports", reportDetails);

        return ResponseEntity.ok(kb.core.dto.ApiResponse.success(response));
    }

    @Operation(summary = "관리자 신고 상태 변경", description = "특정 신고의 상태를 업데이트합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "신고 상태 업데이트 성공")
    })
    @PatchMapping("api/v1/kickboard/admin/reports/{reportId}/status")
    public ResponseEntity<?> updateReportStatus(
            @Parameter(description = "신고 ID", required = true) @PathVariable Long reportId,
            @RequestBody @Valid ReportStatusUpdateRequest request) {

        reportService.updateReportStatus(reportId, request.getStatus());
        return ResponseEntity.ok(kb.core.dto.ApiResponse.success("상태 업데이트 성공"));
    }


}
