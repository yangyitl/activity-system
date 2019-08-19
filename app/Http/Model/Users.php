<?php
/**
 * Created by PhpStorm.
 * User: wenjunchen
 * Date: 2019-03-17
 * Time: 11:44
 */

namespace App\Http\Model;


use Illuminate\Database\Eloquent\Model;

class Users extends Model
{
    public $timestamps = true;

    public $table = 'users';


    public static function recursive($pid)
    {
        $pid = explode(',', $pid);
        if ($pid && !empty($pid)) {
            $data = Users::whereIn('id', $pid)
                ->select('id', 'name')->get()->toArray();

            return $data;
        } else {
            return [];
        }
    }

    public static function afterAdd($add, $extends)
    {

        foreach ($extends as $key => $extend) {
//            var_dump($extend);
            $in = [
                'pid' => $extend['id'],
                'pname' => $extend['name'],
                'sid' => $add['id'],
                'sname' => $add['name'],
                'add_time' => time(),
                'up_time' => time(),
                'updated_at' => time(),
                'created_at' => time()
            ];
            UserRelation::insert($in);
        }
    }




    public static function order($id)
    {
       // var_dump($id);
        //我的订单
        $meOrder = Order::whereStart_idAndUser_id($id, $id)->where('status', '=', 0)->count();

        //未审核订单
        $orMap = [
            ['pstatus', '>=', 1],
            ['pstatus', '<', 3],
            ['pid', '=', $id],
            ['start_id', '!=', $id],
        ];
        $unOrder = Order::where($orMap)->groupBy('order_sn')->get()->toArray();
        $unOrder = count($unOrder);
        $data = [
            'meOrder' => $meOrder,
            'unOrder' => $unOrder,
        ];
        return $data;
    }

}