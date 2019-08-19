<?php

/**
 * 阿里云短信验证码发送类
 *
 * Created by PhpStorm.
 * User: xxzc
 * Date: 2019-01-14
 * Time: 19:19
 */

namespace App\Http\Model;

class Sms
{


    private static $accessKeyId = 'LTAIDnBKTd9kHYB6';
    private static $accessKeySecret = 'oIWHbxflbK3LgeLV8buahXWRzzOohJ';


    /**
     * SMS constructor.
     * @param $accessKeyId
     * @param $accessKeySecret
     */
    public function __construct($accessKeyId, $accessKeySecret)
    {

        self::$accessKeyId = $accessKeyId; //'LTAIyFpKrwlkpC3Q';
        self::$accessKeySecret = $accessKeySecret; //'daN1D8FOVvR9VzlMPvvqLw60GUkqbK';

    }

    /**
     *  uelencode 加密签名 并替换其中特殊字符
     *
     * @param $string
     * @return mixed|string
     */
    private static function percentEncode($string)
    {

        $string = urlencode($string);
        $string = preg_replace('/\+/', '%20', $string);
        $string = preg_replace('/\*/', '%2A', $string);
        $string = preg_replace('/%7E/', '~', $string);

        return $string;

    }


    /**
     * 签名
     *
     * @param array $parameters
     * @return string
     */
    private static function computeSignature($parameters)
    {

        ksort($parameters);

        $signString = '';

        foreach ($parameters as $key => $value) {
            $signString .= '&' . self::percentEncode($key) . '=' . self::percentEncode($value);
        }
        unset($value);

        $stringToSign = 'GET&%2F&' . self::percentencode(substr($signString, 1));
        $signature = base64_encode(hash_hmac('sha1', $stringToSign, self::$accessKeySecret . '&', true));

        return $signature;


    }


    /**
     * 发送短信验证码
     *
     * @param $mobile
     * @param $verifyCode
     * @param string $tempLateCode
     * @return bool|mixed
     */
    public static function sendVerify($mobile, $verifyCode, $tempLateCode = 'upPass')
    {

        $template_name = self::TemplateCode($tempLateCode);
//        var_dump($template_name);
        $params = array(   //此处作了修改
            'SignName' => '纪莱熙',
            'Format' => 'JSON',
            'Version' => '2017-05-25',
            'AccessKeyId' => self::$accessKeyId,
            'SignatureVersion' => '1.0',
            'SignatureMethod' => 'HMAC-SHA1',
            'SignatureNonce' => uniqid(),
            'Timestamp' => gmdate('Y-m-d\TH:i:s\Z'),
            'Action' => 'SendSms',
            'TemplateCode' => $template_name,
            'PhoneNumbers' => $mobile,
            'TemplateParam' => '{"code":"' . $verifyCode . '"}'   //更换为自己的实际模版
        );
        // 计算签名并把签名结果加入请求参数
        $params ['Signature'] = self::computeSignature($params);
        // 发送请求（此处作了修改）
        //$url = 'https://sms.aliyuncs.com/?' . http_build_query ( $params );
        $url = 'https://dysmsapi.aliyuncs.com/?' . http_build_query($params);

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);

        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);

        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        curl_setopt($ch, CURLOPT_TIMEOUT, 10);

        $result = curl_exec($ch);

        curl_close($ch);

        $result = json_decode($result, true);

        if (isset ($result['Code']) && $result['Code'] !== 'OK') {
            $error = self::getErrorMessage($result['Code']);
            return $error;
        }

        return true;


    }


    /**
     * 获取详细错误信息
     *
     * 详情请参考  https://help.aliyun.com/knowledge_detail/57717.html?spm=5176.doc55451.6.582.3BlNup
     *
     * @param $status
     * @return mixed
     */
    private static function getErrorMessage($status)
    {

        $message = [
            'isp.RAM_PERMISSION_DENY' => 'RAM权限DENY',
            'isv.OUT_OF_SERVICE' => '业务停机',
            'isv.PRODUCT_UN_SUBSCRIPT' => '未开通云通信产品的阿里云客户',
            'isv.PRODUCT_UNSUBSCRIBE' => '产品未开通',
            'isv.ACCOUNT_NOT_EXISTS' => '账户不存在',
            'isv.ACCOUNT_ABNORMAL' => '账户异常',
            'isv.SMS_TEMPLATE_ILLEGAL' => '短信模板不合法',
            'isv.SMS_SIGNATURE_ILLEGAL' => '短信签名不合法',
            'isv.INVALID_PARAMETERS' => '参数异常',
            'isp.SYSTEM_ERROR' => '请重试接口调用，如仍存在此情况请创建工单反馈工程师查看',
            'isv.MOBILE_NUMBER_ILLEGAL' => '非法手机号',
            'isv.MOBILE_COUNT_OVER_LIMIT' => '手机号码数量超过限制',
            'isv.TEMPLATE_MISSING_PARAMETERS' => '模板缺少变量',
            'isv.BUSINESS_LIMIT_CONTROL' => '每分钟只能发送一条验证码',
            'isv.INVALID_JSON_PARAM' => 'JSON参数不合法，只接受字符串值',
            'isv.BLACK_KEY_CONTROL_LIMIT' => '黑名单管控',
            'isv.PARAM_LENGTH_LIMIT' => '参数超出长度限制',
            'isv.PARAM_NOT_SUPPORT_URL' => '不支持URL',
            'isv.AMOUNT_NOT_ENOUGH' => '账户余额不足',
            'isv.TEMPLATE_PARAMS_ILLEGAL' => '模板变量里包含非法关键字',
            'SignatureDoesNotMatch' => 'Signature加密错误',
            'InvalidTimeStamp.Expired' => '时间戳错误，发出请求的时间和服务器接收到请求的时间不在15分钟内。',
            'SignatureNonceUsed' => '唯一随机数重复，SignatureNonce为唯一随机数，用于防止网络重放攻击。',
            'InvalidVersion' => '版本号错误，需要确认接口的版本号',
            'InvalidAction.NotFound' => '接口名错误，需要确认接口地址和接口名',

        ];
        if (isset ($message[$status])) {
            return $message[$status];
        }

        return $status;


    }


    /**
     *  选择消息模板
     *
     * @param string $templateCode
     * @return bool|mixed
     */
    private static function TemplateCode($templateCode = 'pass')
    {
//        var_dump($templateCode);
        $template = [
            'login' => 'SMS_170347727', // 登录确认验证码
            'register' => 'SMS_170347727', // 用户注册验证码
            'updatePass' => 'SMS_170347727', // 修改密码验证码
            'updateData' => 'SMS_170347727', // 信息变更验证码
            'pass' => 'SMS_170347727', // 信息变更验证码
        ];

        if (isset($template[$templateCode])) {
            return $template[$templateCode];
        } else {
            return $template['login'];
        }

    }


}