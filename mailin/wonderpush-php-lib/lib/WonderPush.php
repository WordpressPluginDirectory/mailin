<?php

namespace WonderPush;

use WonderPush\Net\Request;

if (count(get_included_files()) === 1) { http_response_code(403); exit(); } // Prevent direct access

/**
 * **WonderPush library entry class.**
 */
class WonderPush {

  /**
   * WonderPush Management API base URL.
   *
   * Must contain scheme, host and optional port.
   * Can contain an additional path.
   * Must not end with a slash.
   * @see getApiBase()
   * @see getApiRoot()
   */
  const WONDERPUSH_MANAGEMENT_API_BASE = 'https://management-api.wonderpush.com'; // DO NOT END WITH SLASH

  /**
   * @deprecated
   */
  const API_BASE = self::WONDERPUSH_MANAGEMENT_API_BASE;

  /**
   * Brevo Management API base URL.
   *
   * Must contain scheme, host and optional port.
   * Can contain an additional path.
   * Must not end with a slash.
   * @see getApiBase()
   * @see getApiRoot()
   */
  const BREVO_API_BASE = 'https://api.brevo.com/v3/wonderpush'; // DO NOT END WITH SLASH

  /**
   * API version.
   * @see getApiRoot()
   */
  const API_VERSION = 'v1'; // "vX", NO SLASH

  /**
   * API prefix.
   * @see getApiRoot()
   */
  const API_PREFIX = ''; // DO NOT END WITH SLASH

  /**
   * WonderPush PHP library version.
   */
  const VERSION = '2.1.2-dev';

  /** @var Credentials */
  private $credentials;
  /** @var string */
  private $applicationId;
  /** @var string */
  private $apiBase;

  /**
   * The logger to which the library will produce messages.
   * @var Util\Logger
   */
  private static $globalLogger;

  /**
   * The logger to which the library will produce messages.
   * @var Util\Logger
   */
  private $logger;

  /**
   * The HttpClient implementation to use.
   * @var Net\HttpClientInterface
   */
  private $httpClient;

  /**
   * Lazily initialized Rest API.
   * @var Api\Rest
   */
  private $rest;

  /**
   * Lazily initialized Deliveries endpoints.
   * @var Api\Deliveries
   */
  private $deliveries;

  /**
   * Lazily initialized Applications endpoints.
   * @var Api\Applications
   */
  private $applications;

  /**
   * Lazily initialized Segments endpoints.
   * @var Api\Segments
   */
  private $segments;

  /**
   * Lazily initialized Campaigns endpoints.
   * @var Api\Campaigns
   */
  private $campaigns;

  /**
   * Lazily initialized Installations endpoints.
   * @var Api\Installations
   */
  private $installations;

  /**
   * Lazily initialized Stats endpoints
   * @var Api/Stats
   */
  private $stats;

  /**
   * Lazily initialized Events endpoints.
   * @var Api\Events
   */
  private $events;

  /**
   * Constructs the library instance that you can use to send API calls against WonderPush.
   *
   * This is the library entry-point.
   *
   * Relying on an instance instead of a static enables you to easily handle multiple projects,
   * and does not prevent you from creating your own static singleton instance out of it.
   *
   * You can find your credentials in the _Settings_ / _Configuration_ page of {@link https://dashboard.wonderpush.com/ your project dashboard}.
   *
   * @param string|Credentials A credentials object, or a WonderPush access token string
   *    The Management API access token used to perform API calls.
   * @param string $applicationId
   *    The application id corresponding to the access token.
   */
  public function __construct($credentials, $applicationId = null) {
    $this->credentials = is_string($credentials) ? new AccessTokenCredentials($credentials) : $credentials;
    $this->applicationId = $applicationId;
  }

  public function getCredentials() {
    return $this->credentials;
  }

  /**
   * The Management API access token used to perform API calls.
   * @return string
   */
  public function getAccessToken() {
    return $this->accessToken;
  }

  /**
   * The application id corresponding to the access token.
   * @return string
   */
  public function getApplicationId() {
    return $this->applicationId;
  }

  /**
   * The logger to which the library will produce messages, when used outside the scope of a WonderPush instance.
   * @return Util\Logger
   */
  public static function getGlobalLogger() {
    return self::$globalLogger;
  }

  /**
   * Set the logger to which the library will produce messages, when used outside the scope of a WonderPush instance.
   * @param Util\Logger $logger
   */
  public static function setGlobalLogger(Util\Logger $logger) {
    self::$globalLogger = $logger;
  }

  /**
   * The logger to which the library will produce messages.
   * @return Util\Logger
   */
  public function getLogger() {
    return $this->logger ?: self::getGlobalLogger();
  }

  /**
   * Set the logger to which the library will produce messages.
   * @param Util\Logger $logger
   */
  public function setLogger(Util\Logger $logger) {
    $this->logger = $logger;
  }

  /**
   * The HTTP client to use to perform API calls.
   * @return Net\HttpClientInterface
   */
  public function getHttpClient() {
    if ($this->httpClient === null) {
      $this->httpClient = new Net\CurlHttpClient($this);
    }
    return $this->httpClient;
  }

  /**
   * Set the HTTP client to use to perform API calls.
   * @param \WonderPush\Net\HttpClientInterface $httpClient
   */
  public function setHttpClient(Net\HttpClientInterface $httpClient) {
    $this->httpClient = $httpClient;
  }

  /**
   * The API base against which to place API calls.
   * 
   * This is mostly useful for developing the PHP library itself, you should ignore it.
   *
   * @return string
   * @see WONDERPUSH_MANAGEMENT_API_BASE
   */
  public function getApiBase() {
    if ($this->apiBase) {
      return $this->apiBase;
    }
    if ($this->credentials instanceof BrevoAPIKeyV3Credentials) {
      return self::BREVO_API_BASE;
    }
    return self::WONDERPUSH_MANAGEMENT_API_BASE;
  }

  /**
   * The API base against which to place API calls.
   *
   * This is mostly useful for developing the PHP library itself, you should ignore it.
   *
   * @param string $apiBase
   */
  public function setApiBase($apiBase) {
    $this->apiBase = $apiBase;
  }

  /**
   * The API root against which to place API calls.
   *
   * Builds on the API base, API version and API prefix.
   *
   * @return string
   * @see getApiBase()
   * @see API_VERSION
   * @see API_PREFIX
   */
  public function getApiRoot() {
    return $this->getApiBase() . '/' . self::API_VERSION . self::API_PREFIX;
  }

  /**
   * Rest API instance.
   * @return Api\Rest
   */
  public function rest() {
    if ($this->rest === null) {
      $this->rest = new Api\Rest($this);
    }
    return $this->rest;
  }

  /**
   * Deliveries endpoints.
   * @return Api\Deliveries
   */
  public function deliveries() {
    if ($this->deliveries === null) {
      $this->deliveries = new Api\Deliveries($this);
    }
    return $this->deliveries;
  }

  /**
   * Application endpoints
   * @return Api\Applications
   */
  public function applications() {
    if ($this->applications === null) {
      $this->applications = new Api\Applications($this);
    }
    return $this->applications;
  }

  /**
   * Segments endpoints
   * @return Api\Segments
   */
  public function segments() {
    if ($this->segments === null) {
      $this->segments = new Api\Segments($this);
    }
    return $this->segments;
  }

  /**
   * Installation endpoints
   * @return Api\Installations
   */
  public function installations() {
    if ($this->installations === null) {
      $this->installations = new Api\Installations($this);
    }
    return $this->installations;
  }

  /**
   * Campaigns endpoints
   * @return Api\Campaigns
   */
  public function campaigns() {
    if ($this->campaigns === null) {
      $this->campaigns = new Api\Campaigns($this);
    }
    return $this->campaigns;
  }

  /**
   * Stats endpoints
   * @return Api\Stats
   */
  public function stats() {
    if ($this->stats === null) {
      $this->stats = new Api\Stats($this);
    }
    return $this->stats;
  }

  /**
   * Event endpoints
   * @return Api\Events
   */
  public function events() {
    if ($this->events === null) {
      $this->events = new Api\Events($this);
    }
    return $this->events;
  }

}

interface Credentials {
  /**
   * @param Request $request
   * @return mixed
   */
  public function authenticate($request);
}

class AccessTokenCredentials implements Credentials {

  /** @var string */
  var $accessToken;

  public function __construct($accessToken = null) {
    $this->accessToken = $accessToken;
  }

  public function authenticate($request) {
    $request->setQsParam('accessToken', $this->accessToken);
  }

}

class BrevoAPIKeyV3Credentials implements Credentials {

  /** @var string */
  var $apiKey;

  public function __construct($apiKey = null) {
    $this->apiKey = $apiKey;
  }

  public function authenticate($request) {
    $request->setHeader('api-key', $this->apiKey);
  }

}

WonderPush::setGlobalLogger(new Util\DefaultLogger());
