# Change Log

## [v0.6.6](https://github.com/ks888/LambStatus/tree/v0.6.6) (2019-11-01)
[Full Changelog](https://github.com/ks888/LambStatus/compare/v0.6.5...v0.6.6)

### Fixed

- [\#170](https://github.com/ks888/LambStatus/issues/170): Upgrade to node.js 10.x (thanks [@allcloud-ronen](https://github.com/allcloud-ronen))

## [v0.6.5](https://github.com/ks888/LambStatus/tree/v0.6.5) (2018-10-25)
[Full Changelog](https://github.com/ks888/LambStatus/compare/v0.6.4...v0.6.5)

### Added

- [\#131](https://github.com/ks888/LambStatus/pull/131): Add AdminPageCloudFrontDomainName and StatusPageCloudFrontDomainName outputs (thanks [@salekseev](https://github.com/salekseev))

## [v0.6.4](https://github.com/ks888/LambStatus/tree/v0.6.4) (2018-06-29)
[Full Changelog](https://github.com/ks888/LambStatus/compare/v0.6.3...v0.6.4)

### Fixed

- [\#127](https://github.com/ks888/LambStatus/issues/127): Fix the wrong link to maintenance (thanks [@chenrui333](https://github.com/chenrui333))

## [v0.6.3](https://github.com/ks888/LambStatus/tree/v0.6.3) (2018-06-22)
[Full Changelog](https://github.com/ks888/LambStatus/compare/v0.6.2...v0.6.3)

### Fixed

- [\#115](https://github.com/ks888/LambStatus/issues/115): Restrict S3 bucket access to cloudfront via AOID (thanks [@iconara](https://github.com/iconara) and [@mijdavis2](https://github.com/mijdavis2))
- [\#120](https://github.com/ks888/LambStatus/issues/120): Improve scheduled maintenance ordering (thanks [@stevenolen](https://github.com/stevenolen))
- [\#125](https://github.com/ks888/LambStatus/issues/125): Improve IE11 support (thanks [@jhackett1](https://github.com/jhackett1))

## [v0.6.2](https://github.com/ks888/LambStatus/tree/v0.6.2) (2018-04-23)
[Full Changelog](https://github.com/ks888/LambStatus/compare/v0.6.1...v0.6.2)

### Added

- [\#108](https://github.com/ks888/LambStatus/issues/108): Guide for custom uptime metrics (thanks [@wmnnd](https://github.com/wmnnd))
- [\#109](https://github.com/ks888/LambStatus/issues/109): API for adding scheduled maintenance (thanks [@jaredsmith](https://github.com/jaredsmith))

### Fixed

- [\#117](https://github.com/ks888/LambStatus/issues/117): Upgrade to node.js 8.10
- [\#112](https://github.com/ks888/LambStatus/issues/112): ISO 8601 formatted dates with timezone offsets are interpreted as being Z formatted (thanks [@poswald](https://github.com/poswald))
- [\#102](https://github.com/ks888/LambStatus/issues/102): Force HTTPS (thanks [@nodomain](https://github.com/nodomain))

## [v0.6.1](https://github.com/ks888/LambStatus/tree/v0.6.1) (2018-02-22)
[Full Changelog](https://github.com/ks888/LambStatus/compare/v0.6.0...v0.6.1)

### Fixed

- [\#98](https://github.com/ks888/LambStatus/issues/98): Shorten the cache lifetime of `settings.js` (thanks [@chris-scentregroup](https://github.com/chris-scentregroup))

## [v0.6.0](https://github.com/ks888/LambStatus/tree/v0.6.0) (2018-02-18)
[Full Changelog](https://github.com/ks888/LambStatus/compare/v0.5.1...v0.6.0)

### Added

- [\#17](https://github.com/ks888/LambStatus/issues/17): Support email notification

## [v0.5.1](https://github.com/ks888/LambStatus/tree/v0.5.1) (2018-01-27)
[Full Changelog](https://github.com/ks888/LambStatus/compare/v0.5.0...v0.5.1)

### Added

- [\#89](https://github.com/ks888/LambStatus/pull/89): Enable admins to upload a brand logo and show it on their status page
- [\#87](https://github.com/ks888/LambStatus/issues/87): Change the background color of the status page

### Fixed

- [\#85](https://github.com/ks888/LambStatus/issues/85): Git ignore .env (thanks [@kbariotis](https://github.com/kbariotis))
- [\#61](https://github.com/ks888/LambStatus/issues/61): Change the color of the header according to the service status (thanks [@kbariotis](https://github.com/kbariotis))

## [v0.5.0](https://github.com/ks888/LambStatus/tree/v0.5.0) (2018-01-06)
[Full Changelog](https://github.com/ks888/LambStatus/compare/v0.4.3...v0.5.0)

### Added

- [\#80](https://github.com/ks888/LambStatus/pull/80): Add [the landing and documentation page](https://lambstatus.github.io/)
- [\#81](https://github.com/ks888/LambStatus/pull/81): Mobile UI support
- [\#79](https://github.com/ks888/LambStatus/pull/79): nodejs 6.10 support

### Fixed

- [\#73](https://github.com/ks888/LambStatus/issues/73): Hide empty incident cards (thanks [@jpike88](https://github.com/jpike88))
- [\#75](https://github.com/ks888/LambStatus/issues/75): SSL Certificate reject if not in US-east region (thanks [@jpike88](https://github.com/jpike88))

## [v0.4.3](https://github.com/ks888/LambStatus/tree/v0.4.3) (2017-11-26)
[Full Changelog](https://github.com/ks888/LambStatus/compare/v0.4.2...v0.4.3)

### Added

- [\#70](https://github.com/ks888/LambStatus/pull/70): Support custom domain. See the [wiki page](https://github.com/ks888/LambStatus/wiki/Set-up-your-custom-domain) for the usage.

### Fixed

- [\#71](https://github.com/ks888/LambStatus/pull/71): Enforce non-email address in username (thanks [@jpike88](https://github.com/jpike88))

## [v0.4.2](https://github.com/ks888/LambStatus/tree/v0.4.2) (2017-11-10)
[Full Changelog](https://github.com/ks888/LambStatus/compare/v0.4.1...v0.4.2)

### Added

- [\#62](https://github.com/ks888/LambStatus/issues/62): Support API to get, create, update and delete a component and an incident (thanks [@J4cku](https://github.com/J4cku))
- [the API documentation](https://lambstatus.github.io/apidocs/), thanks to the excellent documentation tool [slate](https://github.com/lord/slate)

### Fixed

- [\#65](https://github.com/ks888/LambStatus/pull/65): Serve dependent modules from cdnjs
- [\#63](https://github.com/ks888/LambStatus/issues/63): Set CloudFront in front of API gateway

## [v0.4.1](https://github.com/ks888/LambStatus/tree/v0.4.1) (2017-10-12)
[Full Changelog](https://github.com/ks888/LambStatus/compare/v0.4.0...v0.4.1)

### Added

- [\#56](https://github.com/ks888/LambStatus/issues/56): Add ability to edit Incident timeline (thanks [@ryangravetteadmin](https://github.com/ryangravetteadmin))

### Fixed

- [\#58](https://github.com/ks888/LambStatus/pull/58): Improve frontend performance
- [\#59](https://github.com/ks888/LambStatus/pull/59): Refactoring model

## [v0.4.0](https://github.com/ks888/LambStatus/tree/v0.4.0) (2017-08-13)
[Full Changelog](https://github.com/ks888/LambStatus/compare/v0.3.2...v0.4.0)

### Added

- [\#44](https://github.com/ks888/LambStatus/issues/44): Add LambStatus API v0 to post the metric data (thanks [@ccannell](https://github.com/ccannell))
- [\#49](https://github.com/ks888/LambStatus/issues/49): [Metrics] Add an option to choose the statistics (thanks [@stephencornelius](https://github.com/stephencornelius))
- [\#52](https://github.com/ks888/LambStatus/issues/52): [Metrics] Add commas to group every three digits (thanks [@skyzyx](https://github.com/skyzyx))

### Fixed

- [\#47](https://github.com/ks888/LambStatus/issues/47): The rounded value in the tooltip causes the problem (thanks [@blw9u2012](https://github.com/blw9u2012))
- [\#50](https://github.com/ks888/LambStatus/issues/50): Improve the messages (thanks [@networkdawg](https://github.com/networkdawg))

## [v0.3.2](https://github.com/ks888/LambStatus/tree/v0.3.2) (2017-06-05)
[Full Changelog](https://github.com/ks888/LambStatus/compare/v0.3.1...v0.3.2)

### Added

- [\#38](https://github.com/ks888/LambStatus/issues/38): The external-metrics API support the pagination
- [\#39](https://github.com/ks888/LambStatus/issues/39): Fetch CloudWatch metrics from other regions (thanks [@maximede](https://github.com/maximede))

### Fixed

- [\#36](https://github.com/ks888/LambStatus/issues/36): Endpoint request timed out - 504 on /prod/external-metrics?type=CloudWatch (thanks [@ajohnstone](https://github.com/ajohnstone))

## [v0.3.1](https://github.com/ks888/LambStatus/tree/v0.3.1) (2017-05-27)
[Full Changelog](https://github.com/ks888/LambStatus/compare/v0.3.0...v0.3.1)



- Support dot-type S3 website endpoints [\#35](https://github.com/ks888/LambStatus/pull/35) ([ks888](https://github.com/ks888))
- Improve the appearance of the metrics chart [\#34](https://github.com/ks888/LambStatus/pull/34) ([ks888](https://github.com/ks888))
- Add UI to change the order of components and metrics [\#30](https://github.com/ks888/LambStatus/pull/30) ([ks888](https://github.com/ks888))
- Show 404 message if the path does not match any [\#27](https://github.com/ks888/LambStatus/pull/27) ([ks888](https://github.com/ks888))

## [v0.3.0](https://github.com/ks888/LambStatus/tree/v0.3.0) (2017-05-09)
[Full Changelog](https://github.com/ks888/LambStatus/compare/v0.2.1...v0.3.0)



- Publish rss feeds [\#26](https://github.com/ks888/LambStatus/pull/26) ([ks888](https://github.com/ks888))
- Support custom domain settings [\#25](https://github.com/ks888/LambStatus/pull/25) ([ks888](https://github.com/ks888))
- Add Incident Page to easily share the specific incident [\#24](https://github.com/ks888/LambStatus/pull/24) ([ks888](https://github.com/ks888))
- Auto-deploy APIGateway on updating the stack [\#23](https://github.com/ks888/LambStatus/pull/23) ([ks888](https://github.com/ks888))

## [v0.2.1](https://github.com/ks888/LambStatus/tree/v0.2.1) (2017-04-11)
[Full Changelog](https://github.com/ks888/LambStatus/compare/v0.2.0...v0.2.1)



- Show tooltip to tell the meaning of the item color [\#21](https://github.com/ks888/LambStatus/pull/21) ([ks888](https://github.com/ks888))
- Support scheduled maintenance [\#19](https://github.com/ks888/LambStatus/pull/19) ([ks888](https://github.com/ks888))

## [v0.2.0](https://github.com/ks888/LambStatus/tree/v0.2.0) (2017-03-07)
[Full Changelog](https://github.com/ks888/LambStatus/compare/v0.1.3...v0.2.0)



- Show cloudwatch metrics [\#9](https://github.com/ks888/LambStatus/pull/9) ([ks888](https://github.com/ks888))

## [v0.1.3](https://github.com/ks888/LambStatus/tree/v0.1.3) (2017-01-26)
[Full Changelog](https://github.com/ks888/LambStatus/compare/v0.1.2...v0.1.3)

## [v0.1.2](https://github.com/ks888/LambStatus/tree/v0.1.2) (2017-01-05)
[Full Changelog](https://github.com/ks888/LambStatus/compare/v0.1.1...v0.1.2)

## [v0.1.1](https://github.com/ks888/LambStatus/tree/v0.1.1) (2016-12-27)
[Full Changelog](https://github.com/ks888/LambStatus/compare/v0.1.0...v0.1.1)



- Improve incident error message [\#5](https://github.com/ks888/LambStatus/pull/5) ([ks888](https://github.com/ks888))

## [v0.1.0](https://github.com/ks888/LambStatus/tree/v0.1.0) (2016-12-18)
[Full Changelog](https://github.com/ks888/LambStatus/compare/v0.0.3...v0.1.0)



- Support user management [\#4](https://github.com/ks888/LambStatus/pull/4) ([ks888](https://github.com/ks888))

## [v0.0.3](https://github.com/ks888/LambStatus/tree/v0.0.3) (2016-12-04)
[Full Changelog](https://github.com/ks888/LambStatus/compare/v0.0.2...v0.0.3)

## [v0.0.2](https://github.com/ks888/LambStatus/tree/v0.0.2) (2016-11-23)


- Introduce wercker [\#2](https://github.com/ks888/LambStatus/pull/2) ([ks888](https://github.com/ks888))



\* *This Change Log was automatically generated by [github_changelog_generator](https://github.com/skywinder/Github-Changelog-Generator)*
