// kb/user/internal/service/AuthService.java
package kb.user.internal.service;


import kb.user.api.request.LoginRequest;
import kb.user.api.response.LoginResponse;
import kb.user.api.response.TokenResponse;
import kb.user.internal.config.JwtToken;
import kb.user.internal.config.JwtTokenProvider;
import kb.user.internal.config.RefreshTokenRepository;
import kb.user.internal.domain.User;
import kb.user.internal.repository.LocationRepository;
import kb.user.internal.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
/**
 * 유저 인증 구현
 * @since JDK21
 * @author 채기훈
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    private final LocationRepository locationRepository;
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        JwtToken token = tokenProvider.createToken(user);
        refreshTokenRepository.save(user.getEmail(), token.refreshToken());

        LoginResponse response = new LoginResponse(token.accessToken(), token.refreshToken(),user.getRole().toString(),user.getLocation().getName());

        return response;
    }
}



