<?php

namespace App\Http\Controllers;


use App\Http\Model\ExcException;
use App\Http\Model\Order;
use Illuminate\Http\Request;
use Laravel\Lumen\Routing\Controller as BaseController;

class Controller extends BaseController
{

    public static $parameter = [];
    public static $request = [];


    /**
     * Controller constructor.
     * @param Request $request
     */
    public function __construct(Request $request)
    {

        self::getParameter($request);
        self::$request = $request;

    }


    /**
     * 获取请求参数
     * @param $request
     * @return array|mixed
     */
    public static function getParameter($request)
    {
        $data = json_decode($request->getContent(), true);
        if (!$data) {
            $data = $request->input();
            $path = app()->storagePath('logs/Log/' . date('Ymd') . '.log');
            @mkdir(dirname($path), 0755);
            file_put_contents($path, date('Y-m-d H:i:s') .
                json_encode($data, JSON_UNESCAPED_UNICODE) . "\n",
                FILE_APPEND);
            if (!$data) {
                file_put_contents($path, date('Y-m-d H:i:s') . "##" .
                    file_get_contents('php://input') . "\n", FILE_APPEND);
                $data = file_get_contents('php://input');
                $data = json_decode($data, true);
            }
        } else {
            $path = app()->storagePath('logs/Log/' . date('Ymd') . '.log');
            @mkdir(dirname($path), 0755);
            file_put_contents($path, date('Y-m-d H:i:s') .
                json_encode($data, JSON_UNESCAPED_UNICODE) . "\n",
                FILE_APPEND);
        }
        $data = $data ? $data : [];
        self::$parameter = json_decode(json_encode($data));
        return self::$parameter;
    }


    /**
     * 初始化查询数据
     * @param $data
     * @return mixed
     */
    public static function initArray(&$data, $ob = 'ob')
    {
        if ($ob == 'ob') {
            $data = json_decode(json_encode($data));

            if (isset($data->attributes)) {
                $data = $data->attributes;
            }
        } else {
            $data = json_decode(json_encode($data), true);

            if (isset($data['attributes'])) {
                $data = $data['attributes'];
            }
        }

    }


    /**
     * 接口参数验证
     *
     * @param $rules
     * @param $message
     * @return bool
     * @throws ExcException
     */
    public static function Validator($rules, $message)
    {
        $rule = [];
        $attributeName = [];
        //如果没有验证规则则停止
        if (empty($rules)) {
            return true;
        }
        foreach ($rules as $title => $value) {
            //构建验证规则数组
            $rule[$title] = $value[0];
            //别名数组
            $attributeName[$title] = $value[1];
        }
        $data = json_decode(json_encode(self::$parameter), true);
        $validation = \Validator::make($data, $rule, $message)
            ->setAttributeNames($attributeName);
        //验证失败抛出异常
        if ($validation->fails()) {
            throw new ExcException($validation, 400);
        }
        return true;
    }


    /**
     * 返回数据
     *
     * @param array $data
     * @param int $stats
     * @param string $msg
     */
    public static function returnJson($data = [], $stats = 200, $msg = '成功')
    {

        $list = [
            'msg' => $msg,
            'status' => $stats,
            'data' => $data
        ];

        exit(json_encode($list, JSON_UNESCAPED_UNICODE));


    }

    public function order()
    {
        $arr1 = [
            "201905222329512121217",
            "20190522233140212195",
            "201905211925232895289",
            "201905201538033191284",
            "201905231851212895193",
            "201905201809333191302",
            "201905202059243191823",
            "2019052019133110281578",
            "201905201040596410130",
            "201905191438138102282",
            "201905231954146410386",
            "201905230852592986303",
            "20190520153909319126",
            "201905231903412908218",
            "201905201854213191477",
            "201905202217003191189",
            "201905221157062806225",
            "201905191039588102622",
            "201905211730478102836",
            "201905211917492895482",
            "201905230854402986469",
            "201905201539293191748",
            "201905231931192570695",
            "201905201914283191447",
            "201905202219433191694",
            "201905181322486410503",
            "201905191421038102712",
            "201905211733048102996",
            "201905211920262895905",
            "20190520001727319198",
            "201905230855532986484",
            "201905201612293191236",
            "201905231932182570954",
            "201905202015353191622",
            "201905211014067582398",
            "201905201038256410863",
            "201905191425128102403",
            "201905231952386410573",
            "201905211923022895924",
            "201905201905472754274",
            "201905201427222936934",
            "201905211522382936259",
            "201905212154414305294",
            "201905202119163570178",
            "201905191603059782496",
            "201905190828582926768",
            "201905220753545304404",
            "201905201247482806459",
            "2019052014492510281494",
            "201905201916072754907",
            "201905201554402936978",
            "2019052118593527544",
            "20190521215546430556",
            "201905202137225575169",
            "201905221046519782184",
            "201905231141162123478",
            "201905192327072926878",
            "201905220811525304712",
            "201905221133032727851",
            "2019052014533010281481",
            "201905200753182936420",
            "201905201558312936306",
            "2019052120384727549",
            "201905201145323570626",
            "201905202215473581595",
            "201905201527312952163",
            "201905202202258372694",
            "201905191418472806316",
            "20190520123119290527",
            "201905201051142936688",
            "201905201711072936296",
            "201905212050304610132",
            "201905202112413570140",
            "201905202311293349202",
            "201905181727582926648",
            "201905211510185304912",
            "201905201247082806369",
            "201905221714503253933",
            "201905231956082332396",
            "201905221546333253413",
            "2019052216010710359940",
            "201905221558193253392",
            "201905231906182332208",
            "201905221650063253414",
            "201905231954282332804",
            "20190523195331216424",
            "201905202042055646811",
            "201905201743512332143",
            "201905201747382332741",
            "201905201158392542884",
            "201905202252032542162",
            "20190523194953225371",
            "201905231958582253501",
            "201905221401576581917",
            "201905220717228042528",
            "201905222224456846327",
            "20190520202821349683",
            "201905201237182542759",
            "201905231549542542414",
            "201905231950472253144",
            "201905231826152789573",
            "201905220719448042633",
            "2019052223131110723225",
            "201905211355253288689",
            "201905202248342542138",
            "201905231550502542979",
            "201905231958002253822",
            "20190522070527804283",
            "20190522202142313436",
            "201905202316495655591",
            "201905212306513288523",
            "201905221722583332315",
            "201905202250272542361",
            "201905191934382645374",
            "201905231958412253496",
            "201905220710338042812",
            "201905222024583134363",
            "201905200929373332376",
            "201905221013229938506",
            "201905210859318068986",
            "201905221553108085483",
            "201905211907203379978",
            "201905221502372621849",
            "201905212213563379285",
            "20190522173125808574",
            "201905211849086907267",
            "201905220622103272992",
            "201905200001289938217",
            "201905221256148085609",
            "201905221106032356803",
            "201905211702066563546",
            "20190520143955376156",
            "201905211323208068479",
            "201905221501009938748",
            "201905212125073379802",
            "201905221507522621600",
            "201905211809226860387",
            "201905181531068117500",
            "201905212002226860699",
            "201905192333129938179",
            "201905211936049938550",
            "201905221410408085719",
            "201905211703576563462",
            "201905201440123761990",
            "201905202038353602302",
            "201905221411173602901",
            "201905212144253379353",
            "201905222303262664389",
            "201905211811426860274",
            "201905221717558117697",
            "201905190718303154557",
            "201905192357119938553",
            "201905212018109938811",
            "201905221306386063269",
            "201905190020019211418",
            "201905201928093761334",
            "2019052118434634035",
            "201905221412013602333",
            "20190521215357337920",
            "201905222304592664509",
            "20190521184341690778",
            "201905221547146578746",
            "201905201503493272209",
            "201905192358129938236",
            "201905212022499938537",
            "201905211736482669133",
            "20190522164631266419",
            "201905221651332347633",
            "201905221653552347359",
            "20190522164306266433",
            "201905212214302356688",
            "201905231909112142891",
            "2019051900523520960",
            "201905201136312118843",
            "201905191236552096136",
            "201905231812012096214",
            "201905181626592096604",
            "201905201132212118863",
            "201905181630592096212",
            "201905201134352118205",
            "201905231015162123395",
            "201905222257142238512",
            "20190523101236212387",
            "201905220858162238946",
            "201905222320162238428",
            "201905222250542238305",
            "20190523102721210936",
            "201905222252472238648",
            "201905220925114950764",
            "201905221353042160526",
            "201905222015162065276",
            "20190522192357206394",
            "201905221348022680724",
            "201905201151442533795",
            "201905201623502533623",
            "201905201729592526451",
            "201905192214452678779",
            "201905211558022958348",
            "201905211617422958351",
            "201905221350082680635",
            "201905201901002065445",
            "201905191901042958307",
            "201905201837552159784",
            "201905202220542503354",
            "201905211504112678830",
            "201905211600212958329",
            "201905211630282958445",
            "201905211958442958684",
            "201905201845562503408",
            "201905191904112958143",
            "201905201839322159766",
            "201905211624482503168",
            "201905221047242065953",
            "201905211608512958121",
            "201905220739282958258",
            "20190520100458215932",
            "201905201622452533106",
            "201905201724262526671",
            "201905211627272503955",
            "201905221047472065881",
            "201905211614192958195",
            "201905181836162770721",
            "201905201801378370891",
            "201905201223002065402",
            "20190520144649206585",
            "20190518184859277068",
            "201905201223442065992",
            "201905201447212065786",
            "201905201440182503483",
            "201905200957398370294",
            "201905201452262065698",
            "201905181352402770918",
            "201905201438462668735",
            "201905201255342065141",
            "201905221051482109719",
            "201905201803428042727",
            "201905202221529237507",
            "20190520234903313431",
            "201905201006292663454",
            "201905181330317846100",
            "201905192150113134405",
            "201905182123397846332",
            "20190520133702272663",
            "201905211759122347914",
            "201905201334396589468",
            "201905210735093267156",
            "201905202119456846822",
            "201905211044552621832",
            "2019052022274810426691",
            "201905201037485834422",
            "201905181337047846721",
            "201905192140076907241",
            "201905182132467846634",
            "201905201249363051763",
            "201905211801112347768",
            "201905201529146589646",
            "201905201927012621756",
            "2019052021534710413362",
            "201905202338453134107",
            "2019052022435410426582",
            "201905182154296589100",
            "201905181340387846479",
            "201905201804168085580",
            "201905190038127846127",
            "201905201324296063630",
            "201905220800562253276",
            "201905201337266589537",
            "201905202030312621290",
            "201905182323399237164",
            "201905202346013134867",
            "201905211058452621641",
            "2019052012093710184222",
            "201905182120047846522",
            "201905201507492669954",
            "201905201947012347775",
            "201905201327516063468",
            "201905210644093267419",
            "201905202054352621164",
            "201905192347242253351",
            "201905200132232356824",
            "201905201138512253405",
            "201905200948418574864",
            "201905201134517743728",
            "201905182313182663782",
            "201905192311352495311",
            "201905192252062692505",
            "201905201430442123251",
            "201905201431462123491",
            "201905201432072123540",
            "201905201434592123718",
            "201905211324062239395",
            "201905212309242259865",
            "201905211127464747322",
            "201905202003542363378",
            "20190521115219474723",
            "201905202006252363780",
            "201905211811202363364",
            "201905191851032836765",
            "201905191616192836370",
            "201905191827012836426",
            "201905191342092580480",
            "201905181538016828305",
            "201905201028392580949",
            "201905201043342611540",
            "201905191343382580627",
            "20190519140246258011",
            "20190520102945258010",
            "201905191431292836409",
            "201905181456536828572",
            "201905191403332580610",
            "201905191238462611971",
            "201905191341242580770",
            "201905181507446828690",
            "201905191119374884290",
            "201905192141562611123",
            "201905191337372580909",
            "20190519132209258054",
            "201905191326122580881",
            "201905191331212580999",
            "201905191338032580949",
            "201905191323412580231",
            "201905191327442580745",
            "201905191331592580871",
            "201905191332192580520",
            "201905191340112580524",
            "201905191324012580295",
            "201905191330182580553",
            "201905191332592580691",
            "201905191325592580477",
            "201905191330442580681",
            "201905181522042611754",
            "20190518155102261146",
            "201905182131082611952",
            "201905181443012611348",
            "201905181525072611208",
            "201905181552022611615",
            "201905181051277164250",
            "201905181452102611258",
            "201905181526202611438",
            "201905181633422611538",
            "201905191320232580940",
            "201905181520382611791",
            "201905181531072611836",
            "201905181720212611120",
            "201905191321542580852",
            "201905180949104884113",
            "201905181311002611446",
            "201905180903032611197",
            "201905181007034766177",
            "201905181120424766968",
            "20190518163751488414",
            "201905180913582580668",
            "201905181008384766540",
            "2019051811324947667",
            "201905182122454766635",
            "201905180640564766922",
            "201905181010414766172",
            "201905181519144766105",
            "20190518205131476624",
            "201905182123264766565",
            "201905180644564766489",
            "201905181012344766182",
            "201905191819462754611",
            "201905190934554305975",
            "201905200100042754223",
            "201905191953532946818",
            "201905190936514305396",
            "20190520011049275485",
            "201905182348564609519",
            "201905191902272936347",
            "201905192028144305881",
            "201905200112422754663",
            "201905191612292754682",
            "201905192034162936573",
            "201905192227464305397",
            "201905180902132611367",
            "20190518123038235730",
            "201905191306192347482",
            "201905192319012253926",
            "201905192340442253333",
            "201905191304492347934",
            "20190519231820225379",
            "201905181100292803493",
            "201905181133402663540",
            "201905181312302789383",
            "201905181317016946798",
            "201905181123255834770",
            "2019051816034129211",
            "201905192028093496322",
            "201905181645216657886",
            "201905182208033418582",
            "201905181020166946443",
            "201905181136102663931",
            "201905181209126946400",
            "201905181358362789973",
            "201905181454535834612",
            "201905181637212921489",
            "201905182042223602504",
            "201905192132532594587",
            "201905182227596918942",
            "201905181024256946944",
            "201905181139192663859",
            "201905181301446946717",
            "201905181416062789853",
            "201905181509015834733",
            "20190519173044349623",
            "201905182043143602960",
            "201905191355099659400",
            "201905182256532621517",
            "201905181151396946887",
            "201905181141162663555",
            "201905181314446946238",
            "201905181034255834375",
            "201905181442332921524",
            "201905191735383496865",
            "201905182114563602937",
            "201905192130209659581",
            "201905181806122698883",
            "201905182036323602926",
            "201905181811322698565",
            "201905181905198470588",
            "201905182253562621961",
            "201905191744153332823",
            "201905191656573332874"
        ];
        $arr2065 = [
            "201905222015162065276",
            "201905221350082680635",
            "201905221348022680724",
            "201905211630282958445",
            "201905211958442958684",
            "201905220739282958258",
            "201905211617422958351",
            "201905211600212958329",
            "201905211608512958121",
            "201905211614192958195",
            "201905211558022958348",
            "201905221047472065881",
            "201905221047242065953",
            "201905202220542503354",
            "201905211504112678830",
            "201905211624482503168",
            "201905211627272503955",
            "201905192214452678779",
            "201905201837552159784",
            "201905191901042958307",
            "201905201839322159766",
            "201905191904112958143",
            "201905201724262526671",
            "20190520100458215932",
            "201905201622452533106",
            "201905201729592526451",
            "201905201151442533795",
            "201905201623502533623",
            "201905201845562503408",
            "201905201901002065445",
            "201905201801378370891",
            "201905201440182503483",
            "201905201438462668735",
            "20190518184859277068",
            "201905181352402770918",
            "201905181836162770721",
            "201905201452262065698",
            "201905201447212065786",
            "20190520144649206585",
            "201905201255342065141",
            "201905200957398370294",
            "201905201223442065992",
            "201905201223002065402"
        ];
        $arr2081 = [
            "201905202219433191694",
            "201905181322486410503",
            "201905191421038102712",
            "201905211733048102996",
            "201905211920262895905",
            "201905230854402986469",
            "201905231931192570695",
            "201905201914283191447",
            "201905211014067582398",
            "201905201038256410863",
            "201905191425128102403",
            "201905231952386410573",
            "201905211923022895924",
            "201905230855532986484",
            "201905231932182570954",
            "201905202015353191622",
            "2019052019133110281578",
            "201905201040596410130",
            "201905191438138102282",
            "201905231954146410386",
            "201905211925232895289",
            "201905231851212895193",
            "201905201809333191302",
            "201905202059243191823",
            "201905221157062806225",
            "201905191039588102622",
            "201905211730478102836",
            "201905211917492895482",
            "201905230852592986303",
            "201905231903412908218",
            "201905201854213191477",
            "201905202217003191189",
            "2019052120384727549",
            "201905201145323570626",
            "201905202215473581595",
            "201905201527312952163",
            "201905202202258372694",
            "201905191418472806316",
            "201905221133032727851",
            "2019052014533010281481",
            "201905200753182936420",
            "201905201539293191748",
            "201905201558312936306",
            "201905212050304610132",
            "201905202112413570140",
            "201905202311293349202",
            "201905181727582926648",
            "201905211510185304912",
            "201905201247082806369",
            "20190520123119290527",
            "20190520001727319198",
            "201905201051142936688",
            "201905201612293191236",
            "201905201711072936296",
            "201905212154414305294",
            "201905202119163570178",
            "201905191603059782496",
            "201905190828582926768",
            "201905220753545304404",
            "201905201247482806459",
            "201905201905472754274",
            "201905201538033191284",
            "201905201427222936934",
            "201905211522382936259",
            "20190521215546430556",
            "201905202137225575169",
            "201905221046519782184",
            "201905192327072926878",
            "201905220811525304712",
            "2019052014492510281494",
            "201905201916072754907",
            "20190520153909319126",
            "201905201554402936978",
            "2019052118593527544",
            "201905231141162123478",
            "20190523101236212387",
            "201905231015162123395",
            "201905220925114950764",
            "201905201430442123251",
            "201905201431462123491",
            "201905201432072123540",
            "201905201434592123718",
            "201905211324062239395",
            "201905211127464747322",
            "20190521115219474723",
            "201905211811202363364",
            "201905202003542363378",
            "201905202006252363780"
        ];
        $arr2253 = [
            "201905231958582253501",
            "201905231958412253496",
            "201905231958002253822",
            "201905231950472253144",
            "20190523194953225371",
            "201905191934382645374",
            "201905181531068117500",
            "201905231826152789573",
            "201905220719448042633",
            "2019052223131110723225",
            "201905211355253288689",
            "201905201237182542759",
            "201905231549542542414",
            "201905221717558117697",
            "20190522070527804283",
            "20190522202142313436",
            "201905202316495655591",
            "201905212306513288523",
            "201905202248342542138",
            "201905231550502542979",
            "201905221547146578746",
            "201905220710338042812",
            "201905222024583134363",
            "201905200929373332376",
            "201905221722583332315",
            "201905202250272542361",
            "20190522173125808574",
            "201905221401576581917",
            "201905220717228042528",
            "201905222224456846327",
            "20190520202821349683",
            "201905201158392542884",
            "201905202252032542162",
            "201905222303262664389",
            "201905222304592664509",
            "201905221507522621600",
            "201905211936049938550",
            "201905221410408085719",
            "20190520143955376156",
            "201905221501009938748",
            "201905212018109938811",
            "201905221306386063269",
            "201905201440123761990",
            "201905221411173602901",
            "201905192358129938236",
            "201905212022499938537",
            "201905211736482669133",
            "201905201928093761334",
            "201905221412013602333",
            "201905200001289938217",
            "201905221256148085609",
            "201905221013229938506",
            "201905221553108085483",
            "201905221502372621849",
            "201905211809226860387",
            "201905212002226860699",
            "201905192333129938179",
            "201905211702066563546",
            "201905211323208068479",
            "201905212125073379802",
            "201905212144253379353",
            "201905211811426860274",
            "201905190718303154557",
            "201905192357119938553",
            "201905211703576563462",
            "201905202038353602302",
            "20190521215357337920",
            "20190521184341690778",
            "201905201503493272209",
            "201905212214302356688",
            "201905190020019211418",
            "2019052118434634035",
            "201905212213563379285",
            "201905211849086907267",
            "201905220622103272992",
            "201905221106032356803",
            "201905210859318068986",
            "201905211907203379978",
            "201905221651332347633",
            "201905221653552347359",
            "20190522164306266433",
            "20190522164631266419",
            "201905220800562253276",
            "201905211801112347768",
            "201905201947012347775",
            "201905211759122347914",
            "201905181337047846721",
            "201905182132467846634",
            "201905181340387846479",
            "201905190038127846127",
            "201905182120047846522",
            "201905181330317846100",
            "201905182123397846332",
            "2019052022274810426691",
            "201905201249363051763",
            "201905201529146589646",
            "201905201927012621756",
            "201905202119456846822",
            "201905211044552621832",
            "2019052022435410426582",
            "201905201804168085580",
            "201905201324296063630",
            "201905201337266589537",
            "201905202030312621290",
            "2019052021534710413362",
            "201905202338453134107",
            "201905202346013134867",
            "201905211058452621641",
            "201905201507492669954",
            "201905201327516063468",
            "201905210644093267419",
            "201905202054352621164",
            "201905182323399237164",
            "20190520234903313431",
            "20190520133702272663",
            "201905201334396589468",
            "201905210735093267156",
            "201905201803428042727",
            "201905202221529237507",
            "201905200948418574864",
            "201905201037485834422",
            "201905192140076907241",
            "201905182313182663782",
            "201905182154296589100",
            "201905192252062692505",
            "2019052012093710184222",
            "201905192311352495311",
            "201905200132232356824",
            "201905201006292663454",
            "201905192150113134405",
            "201905201134517743728",
            "201905201138512253405",
            "201905192347242253351"
        ];
        $arr2096 = [
            "201905231812012096214",
            "201905201136312118843",
            "201905201132212118863",
            "201905201134352118205",
            "201905191236552096136",
            "2019051900523520960",
            "201905181630592096212",
            "201905181626592096604"
        ];
        $arr2019 = [
            "20190523102721210936",
            "201905222250542238305",
            "201905222252472238648",
            "201905222257142238512",
            "201905222320162238428",
            "201905220858162238946",
            "201905221051482109719"
        ];
        $arr2121 = [
            "20190522233140212195",
            "201905222329512121217",
            "201905221353042160526"
        ];
        $arr2142 = [
            "201905231909112142891"
        ];
        $arr2164 = [
            "201905231906182332208",
            "201905231954282332804",
            "201905231956082332396",
            "201905221558193253392",
            "201905221650063253414",
            "201905221714503253933",
            "201905221546333253413",
            "2019052216010710359940",
            "20190523195331216424",
            "201905201743512332143",
            "201905201747382332741",
            "201905202042055646811"
        ];
        $arr2259 = [
            "201905212309242259865"
        ];
        $arr = array_diff($arr1, $arr2065,
            $arr2019, $arr2081, $arr2253, $arr2096, $arr2121, $arr2142, $arr2164, $arr2259);

        $order = Order::whereIn('order_sn', $arr)->groupBy('order_sn')->orderBy('id', 'desc')->get()->toArray();
        var_dump($order);
    }

}