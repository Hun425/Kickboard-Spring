package kb.company.domain;// kb/company/internal/domain/Kickboard.java


import jakarta.persistence.*;
import kb.company.domain.Company;
import kb.core.domain.BaseEntity;
import lombok.*;
/**
 * 킥보드 Entity
 * @since JDK21
 * @author 채기훈
 */
@Entity
@Table(name = "Kickboards")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Kickboard extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long kickboardId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "companyId")
    private Company company;

    @Column(nullable = false)
    private String serialNumber;

    @Builder
    public Kickboard(Company company, String serialNumber) {
        this.company = company;
        this.serialNumber = serialNumber;
    }
}