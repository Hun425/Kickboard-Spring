package kb.report.api.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class ReportStatusUpdateRequest {
    @NotNull(message = "상태 값은 필수입니다.")
    private String status; // REPORT_RECEIVED, COLLECT_RECEIVED, COLLECT_PROGRESS, COLLECT_COMPLETED, REPORT_COMPLETED
}
