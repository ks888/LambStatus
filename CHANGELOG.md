# Change Log

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
