import { Typography } from 'antd';
import './MealSection.css';

const { Title } = Typography;

const MealSection = () => {
  return (
    <div className="meal-container">
      <Title level={2} className="meal-title">
        Scan your meal barcode
      </Title>
    </div>
  );
};

export default MealSection;