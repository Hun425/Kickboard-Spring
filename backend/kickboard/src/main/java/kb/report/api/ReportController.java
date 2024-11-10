package kb.report.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import kb.report.api.request.ReportCreateRequest;
import kb.report.api.response.ReportDetailResponse;
import kb.report.api.response.ReportResponse;
import kb.report.internal.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 신고 컨트롤러
 * @since JDK21
 * @author 지예찬
 */
@RestController
@RequestMapping("api/v1/kickboard/reports")
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
    @PostMapping
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
    @GetMapping
    public ResponseEntity<?> getReportsByArea(
            @Parameter(description = "담당 구역", required = true) @RequestParam("area") String area) {

        List<ReportResponse> reports = reportService.getReportsByArea(area);
        return ResponseEntity.ok(kb.core.dto.ApiResponse.success(reports));
    }

    @Operation(summary = "신고자 신고 세부 조회", description = "신고 ID로 특정 신고의 세부 정보를 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "신고 세부 조회 성공", content = @Content(schema = @Schema(implementation = ReportDetailResponse.class))),
    })
    @GetMapping("/{reportId}")
    public ResponseEntity<?> getReportDetail(
            @Parameter(description = "신고 ID", required = true) @PathVariable Long reportId) {

        ReportDetailResponse reportDetail = reportService.getReportDetail(reportId);
        return ResponseEntity.ok(kb.core.dto.ApiResponse.success(reportDetail));
    }



}
