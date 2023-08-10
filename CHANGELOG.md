# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [0.2.0](https://github.com/aerotoad/nebra/compare/v0.1.0...v0.2.0) (2023-08-10)


### ⚠ BREAKING CHANGES

* `first()` and `last()` no longer work as chainable constraints, they now resolve the query like `exec()` with their constraint applied
* `fullText` query constraint has been renamed as `like`
* Knex has been removed as a dependency. The `.knex()` method has been replaced with `.connection()` which now returns the underlying better-sqlite3 instance.

* Change functionality of first and last ([7713af3](https://github.com/aerotoad/nebra/commit/7713af31bf9a0936b3e5fc9796c28cda4e2124fc))
* Remove knex ([140cf4b](https://github.com/aerotoad/nebra/commit/140cf4b4116cf3a785691cccd2ae65e078fab16a))
* Rename `fullText` as `like` ([3d64ba6](https://github.com/aerotoad/nebra/commit/3d64ba6056228be2eca7c3f68d549d5c088a4467))


### Features

* Allow nebra factory to receive database options ([b417cdd](https://github.com/aerotoad/nebra/commit/b417cddf37e6241dfb86e81cb64ec7070afbc4eb))

## [0.1.0](https://github.com/aerotoad/nebra/compare/v0.0.4...v0.1.0) (2023-07-28)


### ⚠ BREAKING CHANGES

* **collection:** `delete()` now expects an objectId string.
* **collection:** `deleteMany()` now expects an array of objectId strings.
* **collection:** `update()` and `updateMany()` now require an ObjectId string as the first argument and the updated object as the second.

* **collection:** Delete many now expects array of ids  ([d482f5d](https://github.com/aerotoad/nebra/commit/d482f5dcbc2f55d43a4b8acb4775fec02e0b6986))
* **collection:** Delete now expects an objectId  ([9ec119e](https://github.com/aerotoad/nebra/commit/9ec119ed28d1958253762f45e9ded3c5d5296543))


### Features

* Add method to close the connection ([2b3b61f](https://github.com/aerotoad/nebra/commit/2b3b61f9e280769731cc506e2f602e4d0bb3f475))
* **collection:** Improve updating logic ([a3b2fc3](https://github.com/aerotoad/nebra/commit/a3b2fc31a07c24abd51ff9c855ede0c9f456df2d))

## [0.0.4](https://github.com/aerotoad/nebra/compare/v0.0.3...v0.0.4) (2023-07-28)


### Bug Fixes

* Exports ([71a55cd](https://github.com/aerotoad/nebra/commit/71a55cd583354bb58b8fc7acc10708453e69639f))

## [0.0.3](https://github.com/aerotoad/nebra/compare/v0.0.2...v0.0.3) (2023-07-28)


### Bug Fixes

* Missing dependencies ([e68d008](https://github.com/aerotoad/nebra/commit/e68d00869e464c4108bf1d58fc6c3dc29c69a8ef))
* Missing dependencies ([4718cf7](https://github.com/aerotoad/nebra/commit/4718cf7727ed4b053d18603b2aacef2945d9eea1))

## 0.0.2 (2023-07-27)


### Features

* Add access to the underlying knex instance ([1333591](https://github.com/aerotoad/nebra/commit/1333591ad8a1a936587862c4e21b0b91815c5ae3))
* Add initial project functionality ([48a3dc4](https://github.com/aerotoad/nebra/commit/48a3dc47b40ca9c655d271e9091b9b9cc6f9eaf5))
* Add support for pagination in lookups ([1a416f8](https://github.com/aerotoad/nebra/commit/1a416f87dc3ba642016114b523711f535c0e07a8))


### Bug Fixes

* Missing options for pagination ([e7f9dd9](https://github.com/aerotoad/nebra/commit/e7f9dd9eea3427b2eb5d2b06297bc54c985313cf))
* Update serialization and transactions ([9ef9b94](https://github.com/aerotoad/nebra/commit/9ef9b942bbf56d0c85a313ada92137df35ff440c))
* Wrong type ([1269d61](https://github.com/aerotoad/nebra/commit/1269d6133d6845a3201def3b3721041a1868c635))
