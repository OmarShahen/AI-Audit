// Example markdown content that can be used for testing the PDF generation
export const exampleAuditReportMarkdown = `
# Security Audit Report

**Company:** TechCorp Inc.  
**Audit Date:** ${new Date().toLocaleDateString()}  
**Auditor:** Security Team  

---

## Executive Summary

This comprehensive security audit was conducted to evaluate the current security posture of TechCorp Inc.'s digital infrastructure. The assessment covered multiple areas including network security, application security, and data protection measures.

### Key Findings Summary

- **Critical Issues:** 2
- **High Priority:** 5  
- **Medium Priority:** 12
- **Low Priority:** 8
- **Overall Security Score:** 7.2/10

---

## 1. Network Security Assessment

### 1.1 Firewall Configuration

The current firewall configuration shows several areas for improvement:

- ✅ **Strengths:**
  - Proper ingress filtering implemented
  - Regular rule updates maintained
  - Logging mechanisms in place

- ❌ **Weaknesses:**
  - Missing egress filtering rules
  - Overly permissive admin access
  - Insufficient monitoring of rule changes

### 1.2 Network Segmentation

Current network architecture analysis:

| Network Segment | Security Level | Recommendation |
|-----------------|---------------|----------------|
| DMZ | High | ✅ Well configured |
| Internal LAN | Medium | ⚠️ Needs improvement |
| Admin Network | Low | ❌ Critical issues |
| Guest Network | Medium | ⚠️ Moderate concerns |

---

## 2. Application Security

### 2.1 Web Application Vulnerabilities

**Critical Finding:** SQL Injection vulnerability discovered in the customer portal.


### 2.2 Authentication & Authorization

Current implementation review:

1. **Multi-Factor Authentication (MFA)**
   - Status: ✅ Implemented
   - Coverage: 85% of admin accounts
   - **Recommendation:** Extend to all user accounts

2. **Password Policies**
   - Minimum length: 8 characters ⚠️
   - Complexity requirements: Basic ❌
   - **Recommendation:** Implement stronger policies

3. **Session Management**
   - Session timeout: 30 minutes ✅
   - Secure cookies: Enabled ✅
   - CSRF protection: Partial ⚠️

---

## 3. Data Protection & Privacy

### 3.1 Data Classification

> **Important:** Sensitive data has been identified but lacks proper classification labels.

Current data handling practices:

- **PII (Personally Identifiable Information)**
  - Storage: Encrypted at rest ✅
  - Transmission: TLS 1.2+ ✅
  - Access controls: Needs improvement ❌

- **Financial Data**
  - PCI DSS compliance: In progress ⚠️
  - Tokenization: Not implemented ❌
  - Audit trails: Incomplete ⚠️

### 3.2 Backup & Recovery

---

## 4. Compliance Assessment

### 4.1 Regulatory Compliance

- **GDPR Compliance:** 70% ⚠️
- **SOX Compliance:** 85% ✅
- **HIPAA Compliance:** N/A
- **PCI DSS Compliance:** 60% ❌

### 4.2 Internal Policy Compliance

1. **Security Policy Adherence:** 75%
2. **Incident Response Procedures:** 90%
3. **Change Management:** 80%
4. **Access Review Process:** 65%

---

## 5. Recommendations & Remediation Plan

### 5.1 Critical Priority (0-30 days)

1. **Fix SQL Injection Vulnerability**
   - Impact: High
   - Effort: Medium
   - Owner: Development Team

2. **Implement Egress Filtering**
   - Impact: High  
   - Effort: Low
   - Owner: Network Team

### 5.2 High Priority (30-90 days)

1. **Enhance Password Policies**
2. **Complete PCI DSS Implementation**
3. **Improve Network Segmentation**
4. **Implement Data Classification System**

### 5.3 Medium Priority (90-180 days)

1. **Security Awareness Training Program**
2. **Automated Vulnerability Scanning**
3. **Enhanced Monitoring & SIEM Implementation**
4. **Business Continuity Planning**

---

## 6. Risk Assessment Matrix

| Risk Category | Likelihood | Impact | Risk Level | Mitigation Priority |
|---------------|------------|--------|------------|-------------------|
| Data Breach | High | Critical | **Critical** | Immediate |
| System Downtime | Medium | High | **High** | 30 days |
| Compliance Violation | Medium | Medium | **Medium** | 90 days |
| Insider Threat | Low | High | **Medium** | 180 days |

---

## 7. Conclusion

The security audit reveals that while TechCorp Inc. has implemented several fundamental security measures, there are critical areas requiring immediate attention. The SQL injection vulnerability poses the most significant immediate risk and should be addressed within the next 30 days.

### Next Steps

1. **Immediate Actions** (0-7 days):
   - Patch SQL injection vulnerability
   - Review and restrict admin access
   - Enable comprehensive logging

2. **Short-term Actions** (7-30 days):
   - Implement missing security controls
   - Conduct security awareness training
   - Update incident response procedures

3. **Long-term Actions** (30+ days):
   - Regular security assessments
   - Continuous monitoring implementation
   - Compliance program maturation

---

## Appendices

### Appendix A: Technical Details
*[Detailed technical findings and evidence]*

### Appendix B: Compliance Mapping
*[Detailed compliance requirements mapping]*

### Appendix C: Remediation Costs
*[Cost analysis for recommended improvements]*

---

**Report prepared by:** Security Audit Team  
**Review date:** ${new Date().toLocaleDateString()}  
**Next audit scheduled:** ${new Date(
  Date.now() + 365 * 24 * 60 * 60 * 1000
).toLocaleDateString()}

*This report contains confidential information and should be handled according to company data classification policies.*
`;

export const examplePlainTextReport = `
SECURITY AUDIT REPORT
=====================

Company: TechCorp Inc.
Audit Date: ${new Date().toLocaleDateString()}
Auditor: Security Team

EXECUTIVE SUMMARY
-----------------

This comprehensive security audit was conducted to evaluate the current security posture of TechCorp Inc.'s digital infrastructure.

Key Findings:
- Critical Issues: 2
- High Priority: 5
- Medium Priority: 12
- Low Priority: 8
- Overall Security Score: 7.2/10

NETWORK SECURITY ASSESSMENT
---------------------------

Firewall Configuration:
Strengths:
- Proper ingress filtering implemented
- Regular rule updates maintained
- Logging mechanisms in place

Weaknesses:
- Missing egress filtering rules
- Overly permissive admin access
- Insufficient monitoring of rule changes

APPLICATION SECURITY
--------------------

Web Application Vulnerabilities:
CRITICAL FINDING: SQL Injection vulnerability discovered in the customer portal.

Authentication & Authorization:
1. Multi-Factor Authentication (MFA) - Implemented (85% coverage)
2. Password Policies - Basic implementation, needs improvement
3. Session Management - Mostly secure, CSRF protection partial

RECOMMENDATIONS
---------------

Critical Priority (0-30 days):
1. Fix SQL Injection Vulnerability
2. Implement Egress Filtering

High Priority (30-90 days):
1. Enhance Password Policies
2. Complete PCI DSS Implementation
3. Improve Network Segmentation

CONCLUSION
----------

The security audit reveals critical areas requiring immediate attention. The SQL injection vulnerability poses the most significant immediate risk and should be addressed within 30 days.

Report prepared by: Security Audit Team
Next audit scheduled: ${new Date(
  Date.now() + 365 * 24 * 60 * 60 * 1000
).toLocaleDateString()}
`;

export const exampleLLMGeneratedReport = ` # Comprehensive IT Infrastructure Audit Report

## Overview

This audit report provides a detailed assessment of the organization's IT infrastructure, security posture, and operational capabilities conducted between **March 1-15, 2024**.

### Audit Scope
- **Network Infrastructure** ✅
- **Security Controls** ✅  
- **Data Management** ✅
- **Compliance Framework** ✅
- **Business Continuity** ✅

---

## 🚨 Critical Findings

### 1. Security Vulnerabilities

**Severity: CRITICAL**

Our analysis identified several high-impact security vulnerabilities:

### 2. Compliance Gaps

> **⚠️ Warning:** Current compliance posture presents significant regulatory risks.

| Standard | Current Status | Gap Analysis |
|----------|---------------|--------------|
| GDPR | 65% Compliant | Missing data mapping |
| SOX | 78% Compliant | Inadequate controls testing |
| ISO 27001 | 45% Compliant | No ISMS framework |

---

## 🔒 Security Assessment Details

### Network Security Architecture

The current network topology shows:

1. **Perimeter Security**
   - Firewall rules: ✅ Configured
   - IDS/IPS: ❌ Not implemented
   - DDoS protection: ⚠️ Basic level only

2. **Internal Network Segmentation**

   
   **Issues Identified:**
   - Flat network design in internal segments
   - Excessive lateral movement possibilities
   - Missing micro-segmentation

### Application Security

**Web Applications Risk Profile:**

- **Authentication Bypass:** 3 instances
- **Privilege Escalation:** 2 critical paths  
- **Data Exposure:** 5 endpoints with sensitive data

---

## 📊 Risk Assessment Matrix

### High-Risk Areas

1. **Data Protection** 
   - Risk Level: **HIGH** 🔴
   - Impact: Regulatory fines, reputation damage
   - Likelihood: 75%

2. **System Availability**
   - Risk Level: **MEDIUM** 🟡  
   - Impact: Business disruption
   - Likelihood: 45%

3. **Insider Threats**
   - Risk Level: **MEDIUM** 🟡
   - Impact: Data theft, sabotage  
   - Likelihood: 30%

### Risk Heat Map

\`\`\`
High Impact     │ 🔴🔴🟡   │
Medium Impact   │ 🟡🟢🟢   │  
Low Impact      │ 🟢🟢🟢   │
                └─────────┘
                Low Med High
                Likelihood
\`\`\`

---

## 💡 Strategic Recommendations  

### Phase 1: Immediate Actions (0-30 days)

- [ ] **Patch critical vulnerabilities**
  - SQL injection fixes
  - Authentication strengthening
  - Access control reviews

- [ ] **Implement emergency procedures**
  - Incident response activation
  - Communication protocols
  - Evidence preservation

### Phase 2: Short-term Improvements (30-90 days)

1. **Security Controls Enhancement**
   - Deploy SIEM solution
   - Implement endpoint detection
   - Establish security monitoring

2. **Compliance Program**
   - Data mapping initiatives  
   - Policy documentation
   - Staff training programs

### Phase 3: Long-term Strategy (90+ days)

> **Strategic Vision:** Transform security posture from reactive to proactive

**Key Initiatives:**
- Zero-trust architecture implementation
- Advanced threat hunting capabilities
- Automated compliance monitoring
- Security culture development

---

## 📈 Cost-Benefit Analysis

### Investment Requirements

| Category | Cost Range | Expected ROI | Timeline |
|----------|------------|--------------|----------|
| Security Tools | $150K - $300K | 300% | 12 months |
| Staff Training | $50K - $100K | 250% | 6 months |
| Compliance Program | $200K - $400K | 400% | 18 months |

### Risk Mitigation Value

Implementing these recommendations could prevent:
- **$2.5M** in potential regulatory fines
- **$5M** in business disruption costs  
- **$1.2M** in reputation damage

---

## 🔍 Technical Deep Dive

### Infrastructure Assessment

**Server Environment:**
\`\`\`bash
# Current server inventory
Web Servers: 12 (Ubuntu 20.04 LTS)
Database Servers: 4 (PostgreSQL 13.2)  
Application Servers: 8 (Node.js 16.x)
Load Balancers: 2 (NGINX 1.21)

# Vulnerability scan summary
Critical: 23 findings
High: 67 findings  
Medium: 156 findings
\`\`\`

**Network Performance Metrics:**
- Average latency: 45ms (target: <30ms)
- Packet loss rate: 0.3% (acceptable: <0.1%)
- Bandwidth utilization: 67% peak (concern: >70%)

---

## 🎯 Success Metrics & KPIs

### Security Metrics
- **Mean Time to Detection (MTTD):** Currently 72 hours → Target: <4 hours
- **Mean Time to Response (MTTR):** Currently 48 hours → Target: <2 hours  
- **Vulnerability Remediation:** Currently 30 days → Target: <7 days

### Compliance Metrics
- **Policy Adherence:** 68% → Target: 95%
- **Training Completion:** 34% → Target: 100%
- **Audit Readiness:** 45% → Target: 90%

---

## 🚀 Implementation Roadmap

\`\`\`mermaid
gantt
    title Security Improvement Timeline
    dateFormat  YYYY-MM-DD
    section Critical Fixes
    SQL Injection Patches    :2024-03-16, 7d
    Access Control Review    :2024-03-18, 14d
    
    section Security Tools  
    SIEM Deployment         :2024-04-01, 30d
    Endpoint Protection     :2024-04-15, 21d
    
    section Compliance
    Policy Updates          :2024-05-01, 45d
    Staff Training          :2024-05-15, 60d
\`\`\`

---

## 📋 Conclusion & Next Steps

### Executive Summary
This comprehensive audit reveals significant opportunities to strengthen our security posture and compliance framework. While critical vulnerabilities require immediate attention, the organization demonstrates strong foundational capabilities that can be enhanced through strategic investments.

### Immediate Action Items
1. **Schedule emergency security meeting** within 48 hours
2. **Allocate emergency budget** for critical vulnerability remediation
3. **Engage security vendors** for rapid deployment of essential tools
4. **Communicate with stakeholders** about audit findings and improvement plans

### Long-term Vision
Transform the organization into a security-first entity with:
- **Proactive threat detection** and response capabilities
- **Automated compliance** monitoring and reporting  
- **Security-aware culture** at all organizational levels
- **Continuous improvement** processes and metrics

---

**Audit Team:** Senior Security Consultants  
**Report Date:** ${new Date().toLocaleDateString()}  
**Validity Period:** 12 months  
**Next Review:** ${new Date(
  Date.now() + 365 * 24 * 60 * 60 * 1000
).toLocaleDateString()}

*This document contains confidential information. Distribution is restricted to authorized personnel only.*
`;
