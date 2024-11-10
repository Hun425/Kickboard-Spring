package kb.admin.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import kb.admin.api.response.AdminReportResponse;
import kb.admin.internal.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/v1/kickboard/admin/reports")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;

    @Operation(summary = "신고 목록 조회", description = "담당 구역(area)으로 신고 목록을 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "신고 목록 조회 성공", content = @Content(schema = @Schema(implementation = AdminReportResponse.class))),
    })
    @GetMapping
    public ResponseEntity<?> getReportsByArea(
            @Parameter(description = "담당 구역", required = true) @RequestParam("area") String area) {

        Map<String, List<AdminReportResponse>> reports = adminService.getReportsByArea(area);
        return ResponseEntity.ok(kb.core.dto.ApiResponse.success(reports));    }

    @Operation(summary = "신고 상세 조회", description = "serialNumber로 최신 신고를 조회합니다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "신고 상세 조회 성공", content = @Content(schema = @Schema(implementation = AdminReportResponse.class)))
    })
    @GetMapping("/{serialNumber}")
    public ResponseEntity<?> getReportsBySerialNumber(
            @Parameter(description = "serialNumber", required = true) @PathVariable String serialNumber) {

        List<AdminReportResponse> reportDetails = adminService.getReportsBySerialNumber(serialNumber);
        Map<String, Object> response = new HashMap<>();
        response.put("reports", reportDetails);

        return ResponseEntity.ok(kb.core.dto.ApiResponse.success(response));
    }
}
